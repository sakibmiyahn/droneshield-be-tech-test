import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
  ) {}

  async seedSensors(count = 100): Promise<void> {
    try {
      const existingCount = await this.sensorRepository.count();

      if (existingCount >= count) {
        this.logger.log(`seedSensors: skipping seeding sensors count: ${existingCount}`);
        return;
      }

      const sensors: Partial<Sensor>[] = [];

      for (let i = 0; i < count - existingCount; i++) {
        sensors.push({ serial: uuidv4() });
      }

      await this.sensorRepository.insert(sensors);
      this.logger.log(`seedSensors: seeded ${sensors.length} sensors`);
    } catch (err) {
      this.logger.error(`seedSensors:error: ${err?.message || err}`);
      throw new InternalServerErrorException(`Failed to seed sensors: ${err?.message || 'Internal server error'}`);
    }
  }
}
