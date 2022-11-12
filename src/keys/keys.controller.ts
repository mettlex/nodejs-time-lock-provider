import { Controller, Post, Body, UseGuards, HttpCode } from "@nestjs/common";
import { KeysService } from "./keys.service";
import { CreateKeyDto } from "./dto/create-key.dto";
import { UpdateKeyDto } from "./dto/update-key.dto";
import { ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import {
  InternalServerErrorResponse,
  UnauthorizedResponse,
} from "src/app.openapi";
import { AuthGuard } from "@nestjs/passport";
import { ThrottlerBehindProxyGuard } from "src/rate-limit/throttler-behind-proxy.guard";
import routes from "src/routes";
import { Throttle } from "@nestjs/throttler";
import { DeleteKeyDto } from "./dto/delete-key.dto";
import { ReadKeyDto } from "./dto/read-key.dto";
import { StatusKeyDto } from "./dto/status-key.dto";
import { UnlocKeyDto } from "./dto/unlock-key.dto";

@Controller()
@ApiSecurity("API_ACCESS_TOKEN", ["API_ACCESS_TOKEN"])
@ApiResponse({
  status: 401,
  description: "Unauthorized",
  type: UnauthorizedResponse,
})
@ApiResponse({
  status: 500,
  description: "Internal Server Error",
  type: InternalServerErrorResponse,
})
@ApiTags("key")
@UseGuards(AuthGuard("api-access-token"))
@UseGuards(ThrottlerBehindProxyGuard)
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Throttle(5, 3600)
  @Post(routes.CREATE)
  create(@Body() createKeyDto: CreateKeyDto) {
    return this.keysService.create(createKeyDto);
  }

  @HttpCode(200)
  @Post(routes.READ)
  findOne(@Body() readKeyDto: ReadKeyDto) {
    return this.keysService.findOne(readKeyDto);
  }

  @HttpCode(200)
  @Post(routes.UPDATE)
  update(@Body() updateKeyDto: UpdateKeyDto) {
    return this.keysService.update(updateKeyDto);
  }

  @HttpCode(200)
  @Post(routes.DELETE)
  remove(@Body() deleteKeyDto: DeleteKeyDto) {
    return this.keysService.remove(deleteKeyDto);
  }

  @HttpCode(200)
  @Post(routes.STATUS)
  status(@Body() statusKeyDto: StatusKeyDto) {
    return this.keysService.status(statusKeyDto);
  }

  @HttpCode(200)
  @Post(routes.UNLOCK)
  unlock(@Body() unlocKeyDto: UnlocKeyDto) {
    return this.keysService.unlock(unlocKeyDto);
  }
}
