import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import { ENV } from "./lib/env";
import mountRoutes from "./routes/index.route";
import { connectRedis } from "./lib/redis";
import { generalLimiter } from "./middleware/rate-limiter";

function startServer() {
  const app = express();

  // Trust proxy (important for Railway, Render, etc.)
  app.set("trust proxy", 1);

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  // Compression
  app.use(compression());

  // Logging (only in production)
  if (ENV.NODE_ENV === "production") {
    app.use(morgan("combined"));
  } else {
    app.use(morgan("dev"));
  }

  // CORS configuration
  const allowedOrigins = ["http://localhost:3000", "https://tamirseapp.vercel.app", ENV.FRONTEND_URL].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.log("❌ CORS blocked origin:", origin);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  // Body parser
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // Global rate limiter
  app.use("/api", generalLimiter);

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
