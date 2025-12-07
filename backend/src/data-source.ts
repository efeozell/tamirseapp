import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // Railway's full connection string
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  synchronize: false, // Auto-create tables (set to false after first deploy)
  logging: process.env.NODE_ENV === "development",
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});

//TODO: Production'da surekli olarak unauthorized hatasi cozlecek
