import 'dotenv/config';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const logger = new Logger();
  const port = Number(process.env.PORT) || 8000;
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(port);
  logger.log(`server is listening on port: ${port}`);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
