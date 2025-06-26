import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const logger = new Logger();
  const port = Number(process.env.PORT) || 3000;
  const app = await NestFactory.create(AppModule);

  await app.listen(port);
  logger.log(`server is listening on port: ${port}`);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
