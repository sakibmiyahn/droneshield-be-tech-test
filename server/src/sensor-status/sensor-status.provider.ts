import Redis from 'ioredis';
import { Cron } from '@nestjs/schedule';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class SensorStatusProvider {
  private readonly logger = new Logger(SensorStatusProvider.name);

  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    private readonly sensorGateway: SocketGateway,
  ) {}

  @Cron(process.env.SENSOR_STATUS_CRON || '*/2 * * * * ') // Default to every 2 minutes if not set
  async markOfflineSensors() {
    const sensors = await this.sensorRepository.find({ where: { isOnline: true } });
    const offlineSensors: Sensor[] = [];

    for (const sensor of sensors) {
      const redisKey = `sensor:${sensor.serial}`;
      const exists = await this.redis.exists(redisKey);

      if (!exists) offlineSensors.push(sensor);
    }

    if (offlineSensors.length > 0) {
      const serials = offlineSensors.map((s) => s.serial);

      await this.sensorRepository
        .createQueryBuilder('sensor')
        .update(Sensor)
        .set({ isOnline: false })
        .where('serial IN (:...serials)', { serials })
        .execute();

      this.logger.log(`markOfflineSensors - count: ${offlineSensors.length}`);

      // Emit socket updates
      offlineSensors.forEach((sensor) => {
        this.sensorGateway.emitSensorUpdate({
          serial: sensor.serial,
          version: sensor.software?.version || null,
          isOnline: false,
        });
      });
    }
  }
}
