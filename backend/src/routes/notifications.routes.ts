import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { get } from "http";
import { notificationsRoutes } from "../controller/notifications.controller";

const router = express.Router();

router.get("/notifications", authMiddleware.protectRoute, notificationsRoutes.getNotifications);
router.patch("/notifications/:id/read", authMiddleware.protectRoute, notificationsRoutes.readNotificationById);
router.patch("/notifications/read-all", authMiddleware.protectRoute, notificationsRoutes.readAllNotifications);

export default router;
