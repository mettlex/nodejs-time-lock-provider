import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KeysService } from "./keys.service";
import { KeysController } from "./keys.controller";
import { ConfigModule } from "@nestjs/config";
import { Key } from "./entities/key.entity";
import { TimeService } from "src/time/time.service";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Key])],
  controllers: [KeysController],
  providers: [KeysService, TimeService],
})
export class KeysModule {}
