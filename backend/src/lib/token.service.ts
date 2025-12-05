import jwt from "jsonwebtoken";
import { ENV } from "./env";
import { redisClient } from "./redis";

export class TokenService {
  generateToken = (userId: string) => {
    const accessToken = jwt.sign({ userId }, ENV.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userId }, ENV.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  };

  storeRefreshToken = async (userId: string, refreshToken: string) => {
    await redisClient.set(`refreshToken:${userId}`, refreshToken, {
      EX: 7 * 24 * 60 * 60, // 7 days
    });
  };

  setCookies = (res: any, accessToken: string, refreshToken: string) => {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  };
}
