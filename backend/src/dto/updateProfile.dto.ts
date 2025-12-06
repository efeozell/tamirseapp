import { IsEmail, IsString } from "class-validator";

export class UpdateProfileDTO {
  @IsString()
  name?: string;

  @IsString()
  phone?: string;

  @IsString()
  @IsEmail()
  email?: string;
}
