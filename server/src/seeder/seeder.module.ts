import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { Sensor } from '../entities/sensor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
