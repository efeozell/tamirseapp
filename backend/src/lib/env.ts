import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 8000,
  API_BASE_URL: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 8000}/api`,
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};
