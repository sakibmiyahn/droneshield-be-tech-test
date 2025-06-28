import { GrpcController } from './grpc.controller';
import { GrpcService } from './grpc.service';
import { Module } from '@nestjs/common';
import { Sensor } from '../entities/sensor.entity';
import { SensorSoftwareHistory } from '../entities/sensor-software-history.entity';
import { Software } from '../entities/software.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, Software, SensorSoftwareHistory])],
  controllers: [GrpcController],
  providers: [GrpcService],
})
export class GrpcModule {}
