import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class StatusKeyDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(256)
  uuid: string;
}
