import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { getTimestamp } from "./utils";

@Injectable()
export class TimeService {
  private readonly logger = new Logger(TimeService.name);
  public timestamp: number;

  @Cron(CronExpression.EVERY_SECOND)
  async updateTime() {
    try {
      this.timestamp = (await getTimestamp()).timestamp;
    } catch (error) {
      this.logger.debug(error);
    }
  }
}
