import { GetSensorsDto } from './dto/get-sensors.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';

@Injectable()
export class SensorsService {
  private readonly logger = new Logger(SensorsService.name);

  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
  ) {}

  async getSensors(query: GetSensorsDto) {
    try {
      this.logger.log(`getSensors - query: ${JSON.stringify(query)}`);
      const { page = 0, limit = 10 } = query;

      const [data, total] = await this.sensorRepository.findAndCount({
        relations: ['software'],
        skip: page * limit,
        take: limit,
        order: { id: 'ASC' },
      });

      return {
        data: data.map((sensor) => sensor.toResponse()),
        total,
        pageCount: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error fetching sensors:', error);

      throw new HttpException(
        {
          status: 500,
          message: 'Failed to fetch sensors',
          error: error?.message || 'Internal server error',
        },
        500,
      );
    }
  }
}
