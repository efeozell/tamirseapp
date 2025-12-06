import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RequestMessage {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  requestId?: string;

  @Column()
  content?: string;

  @Column()
  sender?: "customer" | "business";

  @Column("simple-array", { nullable: true })
  attachments?: string[];
}
