import { Module } from '@nestjs/common';
import { Sensor } from '../entities/sensor.entity';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor])],
  controllers: [SensorsController],
  providers: [SensorsService],
  exports: [SensorsService],
})
export class SensorsModule {}
