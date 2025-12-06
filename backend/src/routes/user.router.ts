import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { userController } from "../controller/user.controller";

const router = express.Router();

router.get("/profile", authMiddleware.protectRoute, userController.getProfile);
router.patch("/profile", authMiddleware.protectRoute, userController.updateProfile);
router.patch("/profile/business", authMiddleware.protectRoute, userController.updateBusinessProfile);

export default router;
