import express from "express";
import { authController } from "../controller/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authLimiter } from "../middleware/rate-limiter";
const router = express.Router();

// Singleton instance kullan - her route dosyasında yeni instance oluşturmaya gerek yok
router.post("/signup", authLimiter, authController.signup);
router.post("/signup/business", authLimiter, authController.signupBusiness);
router.post("/login", authLimiter, authController.login);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware.protectRoute, authController.me);

export default router;
