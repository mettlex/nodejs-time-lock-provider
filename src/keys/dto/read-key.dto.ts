import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class ReadKeyDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1024)
  admin_password: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(256)
  uuid: string;
}
