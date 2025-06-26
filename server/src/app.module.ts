import ormconfig from './db/ormconfig';
import { Module, OnModuleInit } from '@nestjs/common';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';
import { SensorsModule } from './sensors/sensors.module';
import { SoftwareModule } from './software/software.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [SeederModule, SensorsModule, SoftwareModule, TypeOrmModule.forRoot(ormconfig)],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    await this.seederService.seedSensors();
  }
}
