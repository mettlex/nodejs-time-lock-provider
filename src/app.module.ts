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
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ServersModule } from "./servers/servers.module";

const dbOptions: Partial<TypeOrmModuleOptions> =
  typeof process.env.PG_DATABASE_URL === "string" &&
  process.env.PG_DATABASE_URL.length > 0
    ? {
        url: process.env.PG_DATABASE_URL,
      }
    : {
        host: process.env.PG_DATABASE_HOST,
        port: +process.env.PG_DATABASE_PORT,
        database: process.env.PG_DATABASE_NAME,
        username: process.env.PG_DATABASE_USER,
        password: process.env.PG_DATABASE_PASSWORD,
      };

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
      ...dbOptions,
      type: "postgres",
      extra: {
        options: process.env.PG_DATABASE_EXTRA_OPTIONS,
      },
      ssl: process.env.PG_DATABASE_SSL === "true",
      synchronize: process.env.SYNC_DATABASE === "true",
      autoLoadEntities: true,
      dropSchema: process.env.DROP_DATABASE === "true",
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TimeService],
})
export class AppModule {}
