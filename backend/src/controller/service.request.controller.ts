import { Repository } from "typeorm";
import { Request, Response } from "express";
import { ServiceRequest } from "../entity/ServiceRequest.entity";
import { ServiceRequestDTO } from "../dto/service.request.dto";
import { AppDataSource } from "../data-source";
import { UpdateServiceRequestDTO } from "../dto/update.service.request.dto";
import { Business } from "../entity/Business.entity";
import { RequestMessage } from "../entity/RequestMessage.entity";

class ServiceRequestController {
  constructor(
    private readonly serviceRequestRepo: Repository<ServiceRequest>,
    private readonly businessRepo: Repository<Business>,
    private readonly requestMessageRepo: Repository<RequestMessage>
  ) {}

  createRequest = async (req: Request, res: Response) => {
    try {
      const { shopId, vehicle, issueDescription, selectedIssues, urgency = "medium" } = req.body;
      const userId = (req as any).user?.id; // Auth middleware'den geliyor

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validasyon
      if (!shopId || shopId.trim() === "") {
        return res.status(400).json({ message: "shopId (businessId) is required" });
      }

      if (!vehicle || !issueDescription || !selectedIssues || selectedIssues.length === 0) {
        return res.status(400).json({ message: "Missing required fields: vehicle, issueDescription, selectedIssues" });
      }

      // Frontend'den gelen data'yı backend formatına dönüştür
      const title = `${vehicle.brand} ${vehicle.model} - ${selectedIssues[0] || "Tamir Talebi"}`;
      const description = `${issueDescription}\n\nAraç: ${vehicle.brand} ${vehicle.model} (${vehicle.year})${
        vehicle.mileage ? `\nKm: ${vehicle.mileage}` : ""
      }`;
      const category = selectedIssues[0] || "Genel Tamir";

      const newRequest = this.serviceRequestRepo.create({
        title,
        description,
        category,
        urgency: urgency as "low" | "medium" | "high",
        customerId: userId,
        businessId: shopId,
        status: "pending",
        vehicle: {
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          mileage: vehicle.mileage,
        },
      } as any);

      await this.serviceRequestRepo.save(newRequest);

      return res.status(201).json(newRequest);
    } catch (error) {
      console.error("Error in createRequest:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  getAllRequests = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const userType = (req as any).user?.type;

      if (!userId || !userType) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let requests: ServiceRequest[];

      if (userType === "customer") {
        // Müşteri kendi taleplerini görür
        requests = await this.serviceRequestRepo
          .createQueryBuilder("request")
          .leftJoinAndSelect("request.business", "business")
          .leftJoinAndSelect("request.customer", "customer")
          .select(["request", "customer.id", "customer.name", "customer.email", "customer.phone"])
          .select([
            "request",
            "business.id",
            "business.businessName",
            "business.businessPhone",
            "business.businessAddress",
          ])
          .where("request.customerId = :customerId", { customerId: userId })
          .orderBy("request.createdAt", "DESC")
          .getMany();
      } else if (userType === "business") {
        // İşletme kendisine gelen talepleri görür
        // First get business ID from user
        const business = await this.businessRepo.findOne({ where: { user: { id: userId } } });
        if (!business) {
          return res.status(404).json({ message: "Business not found for this user" });
        }

        requests = await this.serviceRequestRepo
          .createQueryBuilder("request")
          .leftJoinAndSelect("request.customer", "customer")
          .select(["request", "customer.id", "customer.name", "customer.email", "customer.phone"])
          .where("request.businessId = :businessId", { businessId: business.id })
          .orderBy("request.createdAt", "DESC")
          .getMany();
      } else {
        return res.status(403).json({ message: "Invalid user type" });
      }

      return res.status(200).json(requests);
    } catch (error) {
      console.error("Error in getAllRequests:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  getRequestById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const request = await this.serviceRequestRepo
        .createQueryBuilder("request")
        .where("request.id = :id", { id })
        .leftJoinAndSelect("request.customer", "customer")
        .select(["request", "customer.id", "customer.name", "customer.email", "customer.phone"])
        .leftJoinAndSelect("request.business", "business")
        .getOne();

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      return res.status(200).json(request);
    } catch (error) {
      console.error("Error in getRequestById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  updateRequestStatusById = async (req: Request, res: Response) => {
    const data: UpdateServiceRequestDTO = req.body;

    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const userType = (req as any).user?.type;

      if (userType !== "business") {
        return res.status(403).json({ message: "Only businesses can update request status" });
      }
      const serviceRequest = await this.serviceRequestRepo.findOne({
        where: { id },
        relations: ["business", "business.user"],
      });

      if (!serviceRequest) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (!serviceRequest.business) {
        return res.status(400).json({ message: "This request is not assigned to any business" });
      }

      if (serviceRequest.business.user.id !== userId) {
        return res.status(403).json({ message: "You are not authorized to update this request" });
      }

      // Update price first if provided
      if (data.price !== undefined) {
        serviceRequest.price = data.price;
      }

      // Update status and business stats
      if (data.status !== undefined && data.status !== serviceRequest.status) {
        const oldStatus = serviceRequest.status;
        serviceRequest.status = data.status;

        // Add to status history
        if (!serviceRequest.statusHistory) {
          serviceRequest.statusHistory = [];
        }
        serviceRequest.statusHistory.push({
          status: data.status,
          note: data.note,
          timestamp: new Date(),
          updatedBy: "business",
        });

        // Update business stats based on status change
        if (data.status === "approved" && oldStatus === "pending") {
          serviceRequest.business.activeRequests += 1;
          console.log(
            `[STATUS UPDATE] Approved request ${id}. Active requests: ${serviceRequest.business.activeRequests}`
          );
        } else if (data.status === "completed") {
          serviceRequest.completedAt = new Date();

          // Decrease active requests if it was active
          if (oldStatus === "approved" || oldStatus === "in_progress") {
            serviceRequest.business.activeRequests = Math.max(0, serviceRequest.business.activeRequests - 1);
          }

          serviceRequest.business.completedRequests += 1;

          // Update totalEarnings if price is set
          const priceToAdd = serviceRequest.price || 0;
          serviceRequest.business.totalEarnings = (serviceRequest.business.totalEarnings || 0) + priceToAdd;

          console.log(`[STATUS UPDATE] Completed request ${id}`);
          console.log(`  - Price: ${priceToAdd}`);
          console.log(`  - Total Earnings: ${serviceRequest.business.totalEarnings}`);
          console.log(`  - Completed Requests: ${serviceRequest.business.completedRequests}`);
          console.log(`  - Active Requests: ${serviceRequest.business.activeRequests}`);
        }

        // Save business updates
        await this.businessRepo.save(serviceRequest.business);
      }

      // Update other fields
      serviceRequest.businessNotes = data.note ?? serviceRequest.businessNotes;
      serviceRequest.estimatedCompletionDate = data.estimatedCompletionDate ?? serviceRequest.estimatedCompletionDate;

      // Save service request
      await this.serviceRequestRepo.save(serviceRequest);

      return res.status(200).json(serviceRequest);
    } catch (error) {
      console.error("Error in updateRequestStatusById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  updateRequestToApproved = async (req: Request, res: Response) => {
    const data: UpdateServiceRequestDTO = req.body;

    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const userType = (req as any).user?.type;

      if (userType !== "business") {
        return res.status(403).json({ message: "Only businesses can update request status" });
      }
      const serviceRequest = await this.serviceRequestRepo.findOne({
        where: { id },
        relations: ["business", "business.user"],
      });

      if (!serviceRequest) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (!serviceRequest.business) {
        return res.status(400).json({ message: "This request is not assigned to any business" });
      }

      if (serviceRequest.business.user.id !== userId) {
        return res.status(403).json({ message: "You are not authorized to update this request" });
      }

      if (data.status !== undefined) {
        serviceRequest.status = data.status;
      }
      serviceRequest.statusHistory?.push({
        status: "approved",
        note: data.note,
        timestamp: new Date(),
        updatedBy: "business",
      });
      serviceRequest.business.activeRequests += 1;
      serviceRequest.status = "approved";
      serviceRequest.price = data.price ?? serviceRequest.price;
      serviceRequest.businessNotes = data.note ?? serviceRequest.businessNotes;
      serviceRequest.estimatedCompletionDate = data.estimatedCompletionDate ?? serviceRequest.estimatedCompletionDate;
      await this.serviceRequestRepo.save(serviceRequest);
      await this.businessRepo.save(serviceRequest.business);

      return res.status(200).json(serviceRequest);
    } catch (error) {
      console.error("Error in updateRequestStatusById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  updateRequestToRejected = async (req: Request, res: Response) => {
    const { note } = req.body;

    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const userType = (req as any).user?.type;

      if (userType !== "business") {
        return res.status(403).json({ message: "Only businesses can update request status" });
      }
      const serviceRequest = await this.serviceRequestRepo.findOne({
        where: { id },
        relations: ["business", "business.user"],
      });

      if (!serviceRequest) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (!serviceRequest.business) {
        return res.status(400).json({ message: "This request is not assigned to any business" });
      }

      if (serviceRequest.business.user.id !== userId) {
        return res.status(403).json({ message: "You are not authorized to update this request" });
      }

      serviceRequest.statusHistory?.push({
        status: "rejected",
        note,
        timestamp: new Date(),
        updatedBy: "business",
      });
      serviceRequest.status = "rejected";
      serviceRequest.businessNotes = note ?? serviceRequest.businessNotes;
      await this.serviceRequestRepo.save(serviceRequest);

      return res.status(200).json(serviceRequest);
    } catch (error) {
      console.error("Error in updateRequestStatusById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  updateRequestToCompleted = async (req: Request, res: Response) => {
    const { businessNotes } = req.body;

    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const userType = (req as any).user?.type;

      if (userType !== "business") {
        return res.status(403).json({ message: "Only businesses can update request status" });
      }
      const serviceRequest = await this.serviceRequestRepo.findOne({
        where: { id },
        relations: ["business", "business.user"],
      });

      if (!serviceRequest) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (!serviceRequest.business) {
        return res.status(400).json({ message: "This request is not assigned to any business" });
      }

      if (serviceRequest.business.user.id !== userId) {
        return res.status(403).json({ message: "You are not authorized to update this request" });
      }

      if (!serviceRequest.statusHistory) {
        serviceRequest.statusHistory = [];
      }
      serviceRequest.statusHistory.push({
        status: "completed",
        note: businessNotes,
        timestamp: new Date(),
        updatedBy: "business",
      });

      serviceRequest.status = "completed";
      serviceRequest.business.activeRequests = Math.max(0, serviceRequest.business.activeRequests - 1);
      serviceRequest.business.completedRequests += 1;
      serviceRequest.completedAt = new Date();
      serviceRequest.businessNotes = businessNotes ?? serviceRequest.businessNotes;

      // Update totalEarnings if price is set
      if (serviceRequest.price) {
        serviceRequest.business.totalEarnings = (serviceRequest.business.totalEarnings || 0) + serviceRequest.price;
        console.log(`[COMPLETED] Request ${id} completed with price ${serviceRequest.price}`);
        console.log(`  - Total Earnings: ${serviceRequest.business.totalEarnings}`);
        console.log(`  - Completed Requests: ${serviceRequest.business.completedRequests}`);
      }

      await this.serviceRequestRepo.save(serviceRequest);
      await this.businessRepo.save(serviceRequest.business);

      return res.status(200).json(serviceRequest);
    } catch (error) {
      console.error("Error in updateRequestStatusById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  rateRequestById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { rating, review } = req.body;
      const serviceRequest = await this.serviceRequestRepo.findOne({
        where: { id },
        relations: ["business"],
      });
      if (!serviceRequest) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (serviceRequest.status !== "completed") {
        return res.status(400).json({ message: "Only completed requests can be rated" });
      }

      if (serviceRequest.customerId !== (req as any).user?.id) {
        return res.status(403).json({ message: "You are not authorized to rate this request" });
      }

      serviceRequest.rating = rating;
      serviceRequest.review = review;
      await this.serviceRequestRepo.save(serviceRequest);

      // Update business average rating
      if (serviceRequest.business) {
        const allRatedRequests = await this.serviceRequestRepo.find({
          where: {
            businessId: serviceRequest.businessId,
            status: "completed",
          },
          select: ["rating"],
        });

        const ratings = allRatedRequests
          .filter((r) => r.rating !== null && r.rating !== undefined)
          .map((r) => r.rating!);

        if (ratings.length > 0) {
          const averageRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
          serviceRequest.business.averageRating = parseFloat(averageRating.toFixed(2));
          await this.businessRepo.save(serviceRequest.business);
        }
      }

      return res.status(200).json(serviceRequest);
    } catch (error) {
      console.log("Error in rageRequestById: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  payRequestById = async (req: Request, res: Response) => {
    try {
      const { paymentMethod, amount } = req.body;
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const serviceRequest = await this.serviceRequestRepo.findOne({
        where: { id },
        relations: ["business", "business.totalEarnings"],
      });
      if (!serviceRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      if (serviceRequest.customerId !== userId) {
        return res.status(403).json({ message: "You are not authorized to pay for this request" });
      }

      if (!serviceRequest.business) {
        return res.status(400).json({ message: "This request is not assigned to any business" });
      }

      // Ödeme işleme mantığı (örneğin, bir ödeme servis sağlayıcısına entegrasyon) suanlik sahte

      serviceRequest.business.totalEarnings! += amount;
      await this.businessRepo.save(serviceRequest.business);
      return res.status(200).json(serviceRequest);
    } catch (error) {
      console.log("Error i n payRequestById: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  addMessageToRequestById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { content, attachments } = req.body;
      const userId = (req as any).user?.id;
      const serviceRequest = await this.serviceRequestRepo.findOne({ where: { id } });
      if (!serviceRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      if (serviceRequest.customerId !== userId && serviceRequest.businessId !== userId) {
        return res.status(403).json({ message: "You are not authorized to add messages to this request" });
      }

      const newMessage = this.requestMessageRepo.create({
        requestId: serviceRequest.id,
        content,
        sender: serviceRequest.customerId === userId ? "customer" : "business",
        attachments,
      });
      await this.requestMessageRepo.save(newMessage);
      return res.status(201).json(newMessage);
    } catch (error) {
      console.log("Error in addMessageToRequestById: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

const serviceRequestRepo = AppDataSource.getRepository(ServiceRequest);
const businessRepo = AppDataSource.getRepository(Business);
const requestMessageRepo = AppDataSource.getRepository(RequestMessage);
export const serviceRequestController = new ServiceRequestController(
  serviceRequestRepo,
  businessRepo,
  requestMessageRepo
);
