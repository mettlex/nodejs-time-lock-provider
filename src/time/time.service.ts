import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { getTimestamp } from "./time.utils";

@Injectable()
export class TimeService {
  private readonly logger = new Logger(TimeService.name);
  public timestamp: number = 0;
  private interval: ReturnType<typeof setInterval>;

  @Cron(CronExpression.EVERY_30_SECONDS)
  async updateTime() {
    try {
      const t = (await getTimestamp()).timestamp;

      if (t > 1668265525 && t > this.timestamp) {
        this.timestamp = t;

        if (this.interval) {
          clearInterval(this.interval);
        }

        this.interval = setInterval(() => {
          this.timestamp = this.timestamp + 1;
        }, 1000);
      }
    } catch (error) {
      this.logger.debug(error);
    }
  }
}
