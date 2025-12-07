import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // Railway's full connection string
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});
