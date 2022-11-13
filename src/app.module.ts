import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TimeModule } from "./time/time.module";
import { TimeService } from "./time/time.service";
import { KeysModule } from "./keys/keys.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServersModule } from "./servers/servers.module";

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
    KeysModule,
    ServersModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PG_DATABASE_HOST,
      port: +process.env.PG_DATABASE_PORT,
      database: process.env.PG_DATABASE_NAME,
      username: process.env.PG_DATABASE_USER,
      password: process.env.PG_DATABASE_PASSWORD,
      ssl: process.env.PG_DATABASE_SSL === "true",
      extra: {
        options: process.env.PG_DATABASE_EXTRA_OPTIONS,
      },
      synchronize: process.env.SYNC_DATABASE === "true",
      autoLoadEntities: true,
      dropSchema: process.env.DROP_DATABASE === "true",
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TimeService],
})
export class AppModule {}
