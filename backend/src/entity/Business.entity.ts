import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Business {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  businessName!: string;

  @Column("text")
  businessAddress!: string;

  @Column()
  businessPhone!: string;

  @Column("text")
  services!: string;

  @Column()
  workingHours!: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column("float", { default: 0 })
  totalEarnings!: number;

  @Column("int", { default: 0 })
  completedRequests!: number;

  @Column("int", { default: 0 })
  activeRequests!: number;

  @Column("float", { default: 0 })
  averageRating!: number;

  @Column({ default: true })
  isOnline!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.business)
  user!: User;
}
