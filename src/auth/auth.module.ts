import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { HeaderApiAccessTokenStrategy } from "./auth-header-api-access-token.strategy";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [HeaderApiAccessTokenStrategy],
})
export class AuthModule {}
