import { GrpcController } from './grpc.controller';
import { GrpcService } from './grpc.service';
import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { Sensor } from '../entities/sensor.entity';
import { SensorSoftwareHistory } from '../entities/sensor-software-history.entity';
import { SocketModule } from '../socket/socket.module';
import { Software } from '../entities/software.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [RedisModule, SocketModule, TypeOrmModule.forFeature([Sensor, Software, SensorSoftwareHistory])],
  controllers: [GrpcController],
  providers: [GrpcService],
})
export class GrpcModule {}
