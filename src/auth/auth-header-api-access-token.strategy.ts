import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import Strategy from "passport-headerapikey";

@Injectable()
export class HeaderApiAccessTokenStrategy extends PassportStrategy(
  Strategy,
  "api-access-token",
) {
  constructor(private readonly configService: ConfigService) {
    super(
      { header: "API_ACCESS_TOKEN", prefix: "" },
      true,
      async (
        apiAccessToken: string,
        done: (error: Error, data: unknown) => unknown,
      ) => {
        return this.validate(apiAccessToken, done);
      },
    );
  }

  public validate = (
    token: string,
    done: (error: Error, data: unknown) => unknown,
  ) => {
    if (this.configService.get<string>("API_ACCESS_TOKEN") === token) {
      done(null, true);
    }
    done(new UnauthorizedException(), null);
  };
}
