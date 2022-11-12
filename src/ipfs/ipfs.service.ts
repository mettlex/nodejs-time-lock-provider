import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { fromUnixTime } from "date-fns";
import type { IPFS } from "ipfs-core";
import { TimeService } from "src/time/time.service";

let ipfs: IPFS;

const serverInfo = process.env.SERVERINFO_FOR_IPFS || "{}";

@Injectable()
export class IpfsService {
  private readonly logger = new Logger(IpfsService.name);

  constructor(private readonly timeService: TimeService) {
    this.init();
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async broadcastServerInfo() {
    if (!ipfs || !this.timeService.timestamp) {
      return;
    }

    const timestamp = this.timeService.timestamp;

    const hourTimestamp = Math.floor(timestamp / 60 / 60) * 60 * 60;

    this.logger.log(`${timestamp} -> ${hourTimestamp}`);
    this.logger.log(`${fromUnixTime(hourTimestamp).toISOString()}`);

    const pubsubTopic = `timelock-${hourTimestamp}`;

    try {
      await ipfs.pubsub.publish(
        pubsubTopic,
        new TextEncoder().encode(serverInfo),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  async init() {
    this.logger.log(serverInfo);

    try {
      const { create } = await import("ipfs-core");
      ipfs = await create();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
