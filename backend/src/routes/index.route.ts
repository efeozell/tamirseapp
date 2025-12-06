import authRoutes from "./user.routes";
import bussinesRoutes from "./bussiness.router";
import express from "express";
import serviceRequestRoutes from "./service.request.router";
import notificationsRouter from "./notifications.routes";
import userRoutes from "./user.router";

const mountRoutes = (app: express.Application) => {
  app.use("/api/auth", authRoutes);
  app.use("/api", bussinesRoutes);
  app.use("/api", serviceRequestRoutes);
  app.use("/api", notificationsRouter);
  app.use("/api", userRoutes);
};
export default mountRoutes;
