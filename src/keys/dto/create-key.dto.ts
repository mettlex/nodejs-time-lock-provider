import {
  IsNotEmpty,
  IsNumber,
  Min,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateKeyDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1024)
  admin_password: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1024)
  recovery_password: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(256)
  iv: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(5000)
  encrypted_partial_data: string;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @Min(1)
  lock_duration_seconds: number;
}
