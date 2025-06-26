import { Module } from '@nestjs/common';
import { Software } from '../entities/software.entity';
import { SoftwareController } from './software.controller';
import { SoftwareService } from './software.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Software])],
  controllers: [SoftwareController],
  providers: [SoftwareService],
  exports: [SoftwareService],
})
export class SoftwareModule {}
