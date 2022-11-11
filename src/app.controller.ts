import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Throttle } from "@nestjs/throttler";
import { AppService } from "./app.service";
import { TimeService } from "./time/time.service";
import { ThrottlerBehindProxyGuard } from "./rate-limit/throttler-behind-proxy.guard";
import routes from "./routes";

@Controller()
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

  @Throttle(120, 60)
  @Get(routes.GET_TIME)
  getCurrentTime() {
    return {
      timestamp: this.timeService.timestamp,
    };
  }
}
