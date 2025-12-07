import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { serviceRequestController } from "../controller/service.request.controller";
import { requestCreationLimiter, rateLimiter } from "../middleware/rate-limiter";

const router = express.Router();

router.post("/requests", authMiddleware.protectRoute, requestCreationLimiter, serviceRequestController.createRequest);
router.get("/requests", authMiddleware.protectRoute, serviceRequestController.getAllRequests);
router.get("/requests/:id", authMiddleware.protectRoute, serviceRequestController.getRequestById);
router.patch("/requests/:id/status", authMiddleware.protectRoute, serviceRequestController.updateRequestStatusById);
router.patch("/requests/:id/approve", authMiddleware.protectRoute, serviceRequestController.updateRequestToApproved);
router.patch("/requests/:id/reject", authMiddleware.protectRoute, serviceRequestController.updateRequestToRejected);
router.patch("/requests/:id/complete", authMiddleware.protectRoute, serviceRequestController.updateRequestToCompleted);
router.post("/requests/:id/rate", authMiddleware.protectRoute, rateLimiter, serviceRequestController.rateRequestById);
router.post("/requests/:id/pay", authMiddleware.protectRoute, serviceRequestController.payRequestById);
router.post("/requests/:id/messages", authMiddleware.protectRoute, serviceRequestController.addMessageToRequestById);

export default router;
