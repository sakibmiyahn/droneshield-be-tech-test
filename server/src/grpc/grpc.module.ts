import { GrpcController } from './grpc.controller';
import { GrpcService } from './grpc.service';
import { Module } from '@nestjs/common';
import { Sensor } from '../entities/sensor.entity';
import { Software } from '../entities/software.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, Software])],
  controllers: [GrpcController],
  providers: [GrpcService],
})
export class GrpcModule {}
