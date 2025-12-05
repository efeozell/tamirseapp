import { AppDataSource } from "../data-source";
import { User } from "../entity/User.entity";
import { Business } from "../entity/Business.entity";
import bcrypt from "bcrypt";
import { TokenService } from "../lib/token.service";
import jwt from "jsonwebtoken";
import { ENV } from "../lib/env";
import { redisClient } from "../lib/redis";

export class Auth {
  constructor(
    private userRepository = AppDataSource.getRepository(User),
    private businessRepository = AppDataSource.getRepository(Business),
    private tokenService = new TokenService()
  ) {}

  signup = async (req: any, res: any) => {
    const { email, password, name, phone } = req.body;

    const emailExists = await this.userRepository.findOneBy({ email });
    if (emailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const newUser = this.userRepository.create({
        email,
        password: hashedPassword,
        name,
        phone,
        type: "customer",
        isActive: true,
      });

      await this.userRepository.save(newUser);
      return res.status(201).json({
        message: "User created successfully",
      });
    } catch (error) {
      console.log("Error in signup: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  signupBusiness = async (req: any, res: any) => {
    const { email, password, name, phone, businessDetails } = req.body;

    const emailExists = await this.userRepository.findOneBy({ email });
    if (emailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      // Business bilgilerini oluştur
      const business = this.businessRepository.create({
        businessName: businessDetails.businessName,
        businessAddress: businessDetails.businessAddress,
        businessPhone: businessDetails.businessPhone,
        services: businessDetails.services,
        workingHours: businessDetails.workingHours,
        description: businessDetails.description || "",
      });

      // User oluştur (isActive: false - admin onayı bekleyecek)
      const newUser = this.userRepository.create({
        email,
        password: hashedPassword,
        name,
        phone,
        type: "business",
        isActive: false, // Admin onayı bekleyecek
        business: [business],
      });

      await this.userRepository.save(newUser);

      return res.status(201).json({
        message: "Business account request submitted successfully. You will be notified once approved.",
      });
    } catch (error) {
      console.log("Error in signupBusiness: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  login = async (req: any, res: any) => {
    const { email, password } = req.body;
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ["business"],
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // İşletme hesabı aktif değilse giriş izni verme
      if (user.type === "business" && !user.isActive) {
        return res.status(403).json({
          message: "Your business account is pending approval. Please wait for admin confirmation.",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (user && isPasswordValid === true) {
        const { accessToken, refreshToken } = this.tokenService.generateToken(user.id);

        await this.tokenService.storeRefreshToken(user.id, refreshToken);
        this.tokenService.setCookies(res, accessToken, refreshToken);

        // Şifre olmadan user bilgisini döndür
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({
          message: "Login successful",
          user: userWithoutPassword,
        });
      }

      return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
      console.log("Error in login: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  logout = async (req: any, res: any) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(400).json({ message: "No refresh token provided" });
      }

      try {
        const decoded = jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET!);
        await redisClient.del(`refresh_token_${(decoded as any).userId}`);
      } catch (error) {
        console.log("Error in deleting refresh token: ", error);
        return res.status(500).json({ message: "Internal server error" });
      }

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.log("Error in logout: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  me = async (req: any, res: any) => {
    try {
      // req.user middleware tarafından ekleniyor
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["business"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Şifre olmadan kullanıcı bilgilerini döndür
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.log("Error in me: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

// Singleton instance
export const authController = new Auth();
