import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Server } from "./entities/server.entity";

@Injectable()
export class ServersService {
  private readonly logger = new Logger(ServersService.name);
  public servers: Server[] = [];

  constructor(
    @InjectRepository(Server)
    private serversRepository: Repository<Server>,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async setServers() {
    try {
      this.servers = await this.serversRepository.find();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
