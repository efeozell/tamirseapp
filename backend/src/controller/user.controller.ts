import { Repository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User.entity";
import { AppDataSource } from "../data-source";
import { UpdateProfileDTO } from "../dto/updateProfile.dto";
import { Business } from "../entity/Business.entity";

export class UserController {
  constructor(private readonly userRepo: Repository<User>, private readonly businessRepo: Repository<Business>) {}

  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;

      if ((req as any).user?.type !== "business") {
        const user = await this.userRepo.findOne({ where: { id: userId }, relations: ["business"] });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
      }

      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.log("Error in getProfile: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    try {
      const data: UpdateProfileDTO = req.body;
      const userId = (req as any).user?.id;
      const userProfile = await this.userRepo.findOne({ where: { id: userId } });
      if (!userProfile || userProfile.id !== userId) {
        return res.status(404).json({ message: "User not found" });
      }

      Object.assign(userProfile, data);
      await this.userRepo.save(userProfile);
      return res.status(200).json(userProfile);
    } catch (error) {
      console.log("Error in updateProfile: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  updateBusinessProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const {
        businessName,
        businessAddress,
        businessPhone,
        services,
        workingHours,
        description,
        estimatedDeliveryTime,
      } = req.body;
      if ((req as any).user?.type !== "business") {
        return res.status(403).json({ message: "Forbidden: Not a business user" });
      }
      const businessProfile = await this.businessRepo.findOne({ where: { user: { id: userId } } });

      if (!businessProfile) {
        return res.status(404).json({ message: "Business profile not found" });
      }

      if (
        businessName === "" ||
        businessAddress === "" ||
        businessPhone === "" ||
        services === "" ||
        workingHours === "" ||
        description === ""
      ) {
        return res.status(400).json({ message: "Bad Request: Required fields cannot be empty" });
      }

      businessProfile.estimatedDeliveryTime = estimatedDeliveryTime ?? businessProfile.estimatedDeliveryTime;
      businessProfile.businessName = businessName ?? businessProfile.businessName;
      businessProfile.businessAddress = businessAddress ?? businessProfile.businessAddress;
      businessProfile.businessPhone = businessPhone ?? businessProfile.businessPhone;
      businessProfile.services = services ?? businessProfile.services;
      businessProfile.workingHours = workingHours ?? businessProfile.workingHours;
      businessProfile.description = description ?? businessProfile.description;
      await this.businessRepo.save(businessProfile);
      return res.status(200).json(businessProfile);
    } catch (error) {
      console.log("Error in updateBusinessProfile: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

const userRepo = AppDataSource.getRepository(User);
const businessRepo = AppDataSource.getRepository(Business);
export const userController = new UserController(userRepo, businessRepo);
