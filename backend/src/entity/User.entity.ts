import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Business } from "./Business.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  type!: "customer" | "business";

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  phone?: string;

  @OneToMany(() => Business, (business) => business.user, { nullable: true, cascade: true })
  business?: Business[];

  // @OneToMany(() => order, (order) => order.user)
  // orders: order[];
}
