import { Between, IsNull, Not, Repository } from "typeorm";
import { Request, Response } from "express";
import { Business } from "../entity/Business.entity";
import { AppDataSource } from "../data-source";
import { BusinessResponseDTO } from "../dto/bussiness.dto";
import { ServiceRequest } from "../entity/ServiceRequest.entity";
import { ReviewResponseDTO } from "../dto/review.dto";

export class BusinessController {
  constructor(
    private readonly businessRepo: Repository<Business>,
    private readonly serviceRequestRepo: Repository<ServiceRequest>
  ) {}

  // Arrow function kullan - this binding otomatik
  getAllBusinesses = async (req: Request, res: Response): Promise<Response> => {
    try {
      const businesses = await this.businessRepo
        .createQueryBuilder("business")
        .leftJoinAndSelect("business.user", "user")
        .select(["business", "user.id", "user.name", "user.email", "user.type"])
        .where("business.isOnline = :isOnline", { isOnline: true })
        .getMany();
      const response = businesses.map((b) => BusinessResponseDTO.fromEntity(b));
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in getAllBusinesses:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  getBusinessById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const business = await this.businessRepo
        .createQueryBuilder("business")
        .leftJoinAndSelect("business.user", "user")
        .select(["business", "user.id", "user.name", "user.email", "user.type"])
        .where("business.id = :id", { id })
        .getOne();

      const response = business ? BusinessResponseDTO.fromEntity(business) : null;

      if (!business || !response || response.id === undefined) {
        return res.status(404).json({ message: "Business not found" });
      }

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in getBusinessById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  getReviewsByBusinessId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const reviews = await this.serviceRequestRepo.find({
        where: {
          businessId: id,
          status: "completed",
          rating: Not(IsNull()),
        },
        relations: ["customer"],
        order: { completedAt: "DESC" },
      });

      if (!reviews || reviews.length === 0) {
        return res.status(404).json([]);
      }

      // Transform to ReviewResponseDTO
      const response = reviews.map((r) => ReviewResponseDTO.fromServiceRequest(r));
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in getReviewsByBusinessId:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  getStats = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const business = await this.businessRepo.findOne({ where: { id } });

      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      // Get today's date range (00:00:00 to 23:59:59)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Today's total requests
      const todayRequests = await this.serviceRequestRepo.count({
        where: {
          businessId: id,
          createdAt: Between(today, tomorrow),
        },
      });

      // Today's completed requests
      const todayCompletedRequests = await this.serviceRequestRepo.find({
        where: {
          businessId: id,
          status: "completed",
          completedAt: Between(today, tomorrow),
        },
      });

      // Today's earnings (sum of prices from completed requests today)
      const todayEarnings = todayCompletedRequests.reduce((sum, req) => sum + (req.price || 0), 0);

      // Pending approval count
      const pendingApproval = await this.serviceRequestRepo.count({
        where: { businessId: id, status: "pending" },
      });

      // In progress count
      const inProgress = await this.serviceRequestRepo.count({
        where: { businessId: id, status: "in_progress" },
      });

      // Rejected today count
      const rejectedToday = await this.serviceRequestRepo.count({
        where: {
          businessId: id,
          status: "rejected",
          updatedAt: Between(today, tomorrow),
        },
      });

      const response = {
        // Overall stats
        totalEarnings: business.totalEarnings || 0,
        completedRequests: business.completedRequests || 0,
        activeRequests: business.activeRequests || 0,
        averageRating: business.averageRating || 0,

        // Today's stats
        todayEarnings,
        todayRequests,
        completedToday: todayCompletedRequests.length,
        rejectedToday,

        // Status counts
        pendingApproval,
        inProgress,
      };

      res.status(200).json(response);
    } catch (error) {
      console.log("Error in getStats: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

// Singleton instance - tek bir kere oluşturulur
const businessRepo = AppDataSource.getRepository(Business);
const serviceRequestRepo = AppDataSource.getRepository(ServiceRequest);
export const businessController = new BusinessController(businessRepo, serviceRequestRepo);
