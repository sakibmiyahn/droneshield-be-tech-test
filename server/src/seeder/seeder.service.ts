import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
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
    const existingCount = await this.sensorRepository.count();

    if (existingCount >= count) {
      this.logger.log(`DB already has ${existingCount} sensors. Skipping seeding.`);
      return;
    }

    const sensors: Partial<Sensor>[] = [];

    for (let i = 0; i < count - existingCount; i++) {
      sensors.push({ serial: uuidv4() });
    }

    await this.sensorRepository.insert(sensors);
    this.logger.log(`Seeded ${sensors.length} sensors.`);
  }
}
