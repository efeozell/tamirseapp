import express from "express";
import { authController } from "../controller/auth.controller";
const router = express.Router();

// Singleton instance kullan - her route dosyasında yeni instance oluşturmaya gerek yok
router.post("/signup", authController.signup);
router.post("/signup/business", authController.signupBusiness);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.me); // Auth middleware gerekli

export default router;
