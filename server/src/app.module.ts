import ormconfig from './db/ormconfig';
import { GrpcModule } from './grpc/grpc.module';
import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { SeederModule } from './seeder/seeder.module';
import { SensorStatusModule } from './sensor-status/sensor-status.module';
import { SensorsModule } from './sensors/sensors.module';
import { SocketModule } from './socket/socket.module';
import { SoftwareModule } from './software/software.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GrpcModule,
    RedisModule,
    SeederModule,
    SensorStatusModule,
    SensorsModule,
    SocketModule,
    SoftwareModule,
    TypeOrmModule.forRoot(ormconfig),
  ],
})
export class AppModule {}
