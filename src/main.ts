import {
  BadRequestException,
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AtGuard } from 'src/auth/guards/at-guard.guard';

import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

import { AppModule } from 'src/app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const PORT = process.env.PORT || 5000;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', true);

  app.use(helmet());

  app.use(cookieParser());

  // cors
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  // handling requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: errors => new BadRequestException(errors),
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  // handling responses
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalGuards(new AtGuard(new Reflector()));

  await app.listen(PORT);
  logger.log(`Application listening on port ${PORT}`);
}

bootstrap();
