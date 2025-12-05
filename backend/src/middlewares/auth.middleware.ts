import { Repository } from "typeorm";
import { ENV } from "../lib/env";
import { TokenService } from "../lib/token.service";
import jwt from "jsonwebtoken";
import { User } from "../entity/User.entity";
import { AppDataSource } from "../data-source";

export class AuthMiddleware {
  constructor(private tokenService = new TokenService(), private readonly userRepo: Repository<User>) {}

  protectRoute = async (req: any, res: any, next: any) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(accessToken, ENV.ACCESS_TOKEN_SECRET!);
      const user = await this.userRepo.findOne({
        where: { id: (decoded as any).userId },
        select: ["id", "email", "type", "name"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;

      next();
    } catch (error) {
      console.log("Error in protectRoute middleware: ", error);

      return res.status(401).json({ message: "Unauthorized" });
    }
  };

  adminRoute = (req: any, res: any, next: any) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
  };
}

const tokenService = new TokenService();
const userRepo = AppDataSource.getRepository(User);
export const authMiddleware = new AuthMiddleware(tokenService, userRepo);
