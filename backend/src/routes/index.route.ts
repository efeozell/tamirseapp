import authRoutes from "./user.routes";
import bussinesRoutes from "./bussiness.router";
import express from "express";

const mountRoutes = (app: express.Application) => {
  app.use("/api/auth", authRoutes);
  app.use("/api", bussinesRoutes);
};
export default mountRoutes;
