import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { businessController } from "../controller/businnes.controller";

const router = express.Router();

router.get("/businesses", authMiddleware.protectRoute, businessController.getAllBusinesses);
router.get("/businesses/:id", authMiddleware.protectRoute, businessController.getBusinessById);
router.get("/businesses/:id/reviews", authMiddleware.protectRoute, businessController.getReviewsByBusinessId);
router.get("/businesses/:id/stats", authMiddleware.protectRoute, businessController.getStats);

export default router;
