import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Throttle } from "@nestjs/throttler";
import { AppService } from "./app.service";
import { TimeService } from "./time/time.service";
import { ThrottlerBehindProxyGuard } from "./rate-limit/throttler-behind-proxy.guard";
import routes from "./routes";
import { ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { GetCurrentTimeResponse, UnauthorizedResponse } from "./app.openapi";

@Controller()
@ApiSecurity("API_ACCESS_TOKEN", ["API_ACCESS_TOKEN"])
@ApiResponse({
  status: 401,
  description: "Unauthorized",
  type: UnauthorizedResponse,
})
@UseGuards(AuthGuard("api-access-token"))
@UseGuards(ThrottlerBehindProxyGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly timeService: TimeService,
  ) {}

  @Get("/")
  getRoutes() {
    return routes;
  }

  @Get(routes.GET_TIME)
  @Throttle(120, 60)
  @ApiTags("time")
  @ApiResponse({
    status: 200,
    description: "The current timestamp according to the blockchains.",
    type: GetCurrentTimeResponse,
  })
  getCurrentTime() {
    return {
      timestamp: this.timeService.timestamp,
    };
  }
}
