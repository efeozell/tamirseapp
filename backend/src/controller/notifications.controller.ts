import { Repository } from "typeorm";
import { Request, Response } from "express";
import { Notification } from "../entity/Notification.entity";
import { AppDataSource } from "../data-source";

export class NotificationsRoutes {
  constructor(private readonly notificationRepo: Repository<Notification>) {}

  getNotifications = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const notifications = await this.notificationRepo.find({ where: { userId } });
      // Always return array, even if empty
      return res.status(200).json(notifications || []);
    } catch (error) {
      console.log("Error in getNotifications: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  readNotificationById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const notification = await this.notificationRepo.findOne({ where: { id, userId } });
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      notification.isRead = true;
      await this.notificationRepo.save(notification);
      return res.status(200).json(notification);
    } catch (error) {
      console.log("Error in readNotificationById: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  readAllNotifications = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const notifications = await this.notificationRepo.find({ where: { userId } });
      for (const notification of notifications) {
        notification.isRead = true;
        await this.notificationRepo.save(notification);
      }
      return res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
      console.log("Error in readAllNotifications: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

const notificationRepo = AppDataSource.getRepository(Notification);
export const notificationsRoutes = new NotificationsRoutes(notificationRepo);
