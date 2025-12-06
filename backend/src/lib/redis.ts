import { createClient } from "redis";
import { ENV } from "../lib/env";
const redisClient = createClient({
  url: ENV.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: false,
  },
  password: ENV.REDIS_PASSWORD || undefined,
});

// Sessiz mod - sadece successful bağlantıda mesaj göster
redisClient.on("ready", () => console.log("✅ Redis connected successfully"));

export const connectRedis = async () => {
  try {
    // Redis client zaten bağlıysa tekrar connect etme
    if (redisClient.isOpen) {
      console.log("Redis already connected, skipping...");
      return;
    }
    await redisClient.connect();
  } catch (error) {
    throw error;
    console.log(`Error in redis connection ${error}`);
  }
};

export { redisClient };
