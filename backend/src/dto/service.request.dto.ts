import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ServiceRequestDTO {
  @IsNotEmpty()
  @IsNumber()
  bussinessId: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  category: string;

  @IsOptional()
  urgency: string;

  @IsOptional()
  images: string[];
}
