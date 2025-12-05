import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.entity";
import { Business } from "./Business.entity";

export type RequestStatus =
  | "pending" // Müşteri oluşturdu, işletme onaylamadı
  | "approved" // İşletme onayladı
  | "in_progress" // İşletme üzerinde çalışıyor
  | "completed" // İş tamamlandı
  | "rejected" // İşletme reddetti
  | "cancelled"; // Müşteri iptal etti

@Entity()
export class ServiceRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column("text")
  description!: string;

  @Column()
  category!: string;

  @Column()
  urgency!: "low" | "medium" | "high";

  @Column({
    type: "varchar",
    default: "pending",
  })
  status!: RequestStatus;

  @Column("float", { nullable: true })
  price?: number;

  @Column("text", { nullable: true })
  businessNotes?: string;

  @Column("simple-array", { nullable: true })
  images?: string[];

  @Column({ nullable: true })
  estimatedCompletionDate?: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  // Müşteri bilgileri
  @ManyToOne(() => User)
  @JoinColumn()
  customer!: User;

  @Column()
  customerId!: string;

  // İşletme bilgileri
  @ManyToOne(() => Business, { nullable: true })
  @JoinColumn()
  business?: Business;

  @Column({ nullable: true })
  businessId?: string;

  // Status history için JSON column
  @Column("simple-json", { nullable: true })
  statusHistory?: Array<{
    status: RequestStatus;
    note?: string;
    timestamp: Date;
    updatedBy: "customer" | "business";
  }>;

  @Column("float", { nullable: true })
  rating?: number;

  @Column("text", { nullable: true })
  review?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
