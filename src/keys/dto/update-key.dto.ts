import { PartialType } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { CreateKeyDto } from "./create-key.dto";

export class UpdateKeyDto extends PartialType(CreateKeyDto) {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(256)
  uuid: string;
}
