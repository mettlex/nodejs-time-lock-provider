import { ApiProperty } from "@nestjs/swagger";

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
