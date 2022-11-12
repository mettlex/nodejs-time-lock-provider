import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UnlocKeyDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1024)
  recovery_password: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(256)
  uuid: string;
}
