import Redis from 'ioredis';
import { DeviceStatusDto } from './dto/device-status.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { SocketGateway } from '../socket/socket.gateway';
import { SensorSoftwareHistory } from '../entities/sensor-software-history.entity';
import { Software } from '../entities/software.entity';
import { StatusAck } from '../types/interfaces';

@Injectable()
export class GrpcService {
  private readonly logger = new Logger(GrpcService.name);
  private readonly redisTTL = Number(process.env.REDIS_TTL) || 600; // Defaults to 10 minutes if not set

  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
    @InjectRepository(Software)
    private readonly softwareRepository: Repository<Software>,
    @InjectRepository(SensorSoftwareHistory)
    private readonly sensorSoftwareHistoryRepository: Repository<SensorSoftwareHistory>,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    private readonly sensorGateway: SocketGateway,
  ) {}

  async processDeviceStatus(payload: DeviceStatusDto): Promise<StatusAck> {
    try {
      const { serial, softwareVersion } = payload;
      this.logger.debug(`gRPC - serial: ${serial}, version: ${softwareVersion}`);
      const redisKey = `sensor:${serial}`;
      const redisVal = await this.redis.get(redisKey);

      // Check if version is same and sensor was recently online
      if (redisVal === softwareVersion) {
        await this.redis.expire(redisKey, this.redisTTL);
        this.emitSensorUpdate(serial, softwareVersion, true);
        return { message: 'Sensor already online with same version' };
      }

      const sensor = await this.sensorRepository.findOne({ where: { serial } });

      if (!sensor) return { message: `Sensor not found: ${serial}` };

      // Update online status
      sensor.isOnline = true;
      sensor.lastSeenAt = new Date();

      const software = await this.softwareRepository.findOne({ where: { version: softwareVersion } });

      // Track history if version changed
      if (software && sensor.softwareId !== software.id) {
        if (sensor.softwareId) {
          await this.sensorSoftwareHistoryRepository.save(
            this.sensorSoftwareHistoryRepository.create({
              sensor,
              software: { id: sensor.softwareId } as Software,
            }),
          );
        }

        sensor.software = software;
        sensor.softwareId = software.id;
      }

      await this.sensorRepository.save(sensor);
      await this.redis.set(redisKey, softwareVersion, 'EX', this.redisTTL);
      this.emitSensorUpdate(serial, softwareVersion, true);

      return {
        message: software
          ? `Sensor status updated - version: ${softwareVersion}`
          : `Sensor online; unknown version: ${softwareVersion}`,
      };
    } catch (err) {
      this.logger.error('Error processing status:', err?.message || err);
      return { message: 'Internal error processing device status' };
    }
  }

  // Emit update to WebSocket clients
  private emitSensorUpdate(serial: string, version: string | null, isOnline: boolean) {
    this.sensorGateway.emitSensorUpdate({
      serial,
      version,
      isOnline,
    });
  }
}
