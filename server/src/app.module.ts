import ormconfig from './db/ormconfig';
import { GrpcModule } from './grpc/grpc.module';
import { Module } from '@nestjs/common';
import { SeederModule } from './seeder/seeder.module';
import { SensorsModule } from './sensors/sensors.module';
import { SoftwareModule } from './software/software.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [GrpcModule, SeederModule, SensorsModule, SoftwareModule, TypeOrmModule.forRoot(ormconfig)],
})
export class AppModule {}
