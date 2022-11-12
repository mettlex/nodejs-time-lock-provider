import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TimeService } from "src/time/time.service";
import { IpfsService } from "./ipfs.service";

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [IpfsService, TimeService],
})
export class IpfsModule {}
