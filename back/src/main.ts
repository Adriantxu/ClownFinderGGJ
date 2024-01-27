import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as schedule from 'node-schedule';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  app.enableCors();
  app.use(cookieParser());

  await app.listen(3030);
}
bootstrap();

process.on('SIGINT', function () {
  console.log('Shutting down api...');
  schedule.gracefulShutdown().then(() => process.exit(0));
});
