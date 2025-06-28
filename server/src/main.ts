import 'dotenv/config';
import * as path from 'path';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  const logger = new Logger();
  const port = Number(process.env.PORT) || 8000;
  const app = await NestFactory.create(AppModule);

  // Seed the database with sensors
  const seeder = app.get(SeederService);
  await seeder.seedSensors();

  // Enable CORS and validation
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Attach gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'status',
      protoPath: path.join(process.cwd(), 'protos', 'status.proto'),
      url: '0.0.0.0:50051',
    },
  });

  // Start the server and microservices
  await app.startAllMicroservices();
  await app.listen(port);
  logger.log(`server is listening on port: ${port}`);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
