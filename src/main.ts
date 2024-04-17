import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);

  // Add prefix api
  app.setGlobalPrefix('api');

  // Activate globals pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(config.PORT);
  logger.log(`Server listen on port ${config.PORT}`);
}
bootstrap();
