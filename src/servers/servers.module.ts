import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Server } from "./entities/server.entity";
import { ServersController } from "./servers.controller";
import { ServersService } from "./servers.service";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Server])],
  controllers: [ServersController],
  providers: [ServersService],
})
export class ServersModule {}
