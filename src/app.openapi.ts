import { ApiProperty } from "@nestjs/swagger";

export class InternalServerErrorResponse {
  @ApiProperty({
    enum: [500],
    example: 500,
  })
  statusCode: 500;

  @ApiProperty({
    enum: ["Internal Server Error"],
    example: "Internal Server Error",
  })
  message: "Internal Server Error";
}

export class UnauthorizedResponse {
  @ApiProperty({
    enum: [401],
    example: 401,
  })
  statusCode: 401;

  @ApiProperty({
    enum: ["Unauthorized"],
    example: "Unauthorized",
  })
  message: "Unauthorized";
}

export class GetCurrentTimeResponse {
  @ApiProperty({
    description: "The current unix timestamp (seconds)",
    example: 1668177598,
  })
  timestamp: number;
}
