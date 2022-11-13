import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ThrottlerBehindProxyGuard } from "../rate-limit/throttler-behind-proxy.guard";
import { ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { UnauthorizedResponse } from "../app.openapi";
import { ServersService } from "./servers.service";

@Controller()
@ApiTags("servers")
@ApiSecurity("API_ACCESS_TOKEN", ["API_ACCESS_TOKEN"])
@ApiResponse({
  status: 401,
  description: "Unauthorized",
  type: UnauthorizedResponse,
})
@UseGuards(AuthGuard("api-access-token"))
@UseGuards(ThrottlerBehindProxyGuard)
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Get("/servers")
  getServers() {
    return this.serversService.servers;
  }
}
