import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  userId?: string;

  @Column()
  type?: "request_update" | "payment" | "message" | "system";

  @Column()
  message?: string;

  @Column({ default: false })
  isRead?: boolean;

  @Column()
  actionUrl?: string;

  @Column()
  createdAt?: Date;
}
