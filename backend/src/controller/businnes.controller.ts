import { IsNull, Not, Repository } from "typeorm";
import { Request, Response } from "express";
import { Business } from "../entity/Business.entity";
import { AppDataSource } from "../data-source";
import { BusinessResponseDTO } from "../dto/bussiness.dto";
import { ServiceRequest } from "../entity/ServiceRequest.entity";

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
        return res.status(404).json({ message: "No reviews found for this business" });
      }
      return res.status(200).json(reviews);
    } catch (error) {
      console.error("Error in getReviewsByBusinessId:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

// Singleton instance - tek bir kere oluşturulur
const businessRepo = AppDataSource.getRepository(Business);
const serviceRequestRepo = AppDataSource.getRepository(ServiceRequest);
export const businessController = new BusinessController(businessRepo, serviceRequestRepo);
