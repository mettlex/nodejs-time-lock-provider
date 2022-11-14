import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { getTimestamp } from "./time.utils";

@Injectable()
export class TimeService {
  private readonly logger = new Logger(TimeService.name);
  public timestamp: number;

  @Cron(CronExpression.EVERY_5_SECONDS)
  async updateTime() {
    try {
      const t = (await getTimestamp()).timestamp;

      if (t > 1668265525) {
        this.timestamp = t;
      }
    } catch (error) {
      this.logger.debug(error);
    }
  }
}
