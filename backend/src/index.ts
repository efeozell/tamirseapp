import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./data-source";
import { ENV } from "./lib/env";
import mountRoutes from "./routes/index.route";
import { connectRedis } from "./lib/redis";

function startServer() {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true, // Cookie'leri kabul et
    })
  );

  app.use(express.json());
  app.use(cookieParser()); // Cookie'leri parse etmek için

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Backend is running" });
  });

  mountRoutes(app);

  // Initialize database and start server
  AppDataSource.initialize()
    .then(async () => {
      console.log("✅ Database Connected");

      app.listen(ENV.PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${ENV.PORT}`);
        console.log(`📡 API available at http://localhost:${ENV.PORT}/api`);
      });
      await connectRedis();
    })
    .catch((error) => {
      console.error("❌ Database connection failed:", error);
      process.exit(1);
    });
}

startServer();
