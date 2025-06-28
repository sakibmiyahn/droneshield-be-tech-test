import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Sensor } from '../entities/sensor.entity';
import { SensorStatusProvider } from './sensor-status.provider';
import { SocketModule } from '../socket/socket.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [RedisModule, ScheduleModule.forRoot(), SocketModule, TypeOrmModule.forFeature([Sensor])],
  providers: [SensorStatusProvider],
})
export class SensorStatusModule {}
