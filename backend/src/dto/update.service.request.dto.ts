import { IsNotEmpty, IsString } from "class-validator";

export class UpdateServiceRequestDTO {
  @IsNotEmpty()
  status?: "approved" | "in_progress" | "completed" | "rejected" | "cancelled";

  @IsString()
  note?: string;

  @IsNotEmpty()
  price?: number;
  estimatedCompletionDate?: Date;
}
