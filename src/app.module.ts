import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TimeModule } from "./time/time.module";
import { TimeService } from "./time/time.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 300,
    }),
    AuthModule,
    ScheduleModule.forRoot(),
    TimeModule,
  ],
  controllers: [AppController],
  providers: [AppService, TimeService],
})
export class AppModule {}
