import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "@fastify/helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true, trustProxy: true }),
  );

  const config = new DocumentBuilder()
    .setTitle("Time-Lock Provider")
    .addApiKey(
      { type: "apiKey", name: "API_ACCESS_TOKEN", in: "header" },
      "API_ACCESS_TOKEN",
    )
    .setDescription("A key-service provider for the Time-Lock encryption")
    .setVersion("1.0")
    .addTag("key")
    .addTag("time")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("openapi", app, document);

  app.register(helmet, {
    contentSecurityPolicy: false,
  });

  app.enableCors();

  await app.listen(process.env.PORT || 3000, process.env.HOST || "0.0.0.0");
}

bootstrap();
