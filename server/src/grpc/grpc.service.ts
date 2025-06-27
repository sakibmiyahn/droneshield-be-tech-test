import { DeviceStatusDto } from './dto/device-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { Software } from '../entities/software.entity';
import { StatusAck } from '../common/interfaces';

@Injectable()
export class GrpcService {
  private readonly logger = new Logger(GrpcService.name);

  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
    @InjectRepository(Software)
    private readonly softwareRepository: Repository<Software>,
  ) {}

  async processDeviceStatus(payload: DeviceStatusDto): Promise<StatusAck> {
    try {
      const { serial, softwareVersion } = payload;
      this.logger.log(`processDeviceStatus - serial: ${serial} - version: ${softwareVersion}`);
      const sensor = await this.sensorRepository.findOne({ where: { serial } });

      if (!sensor) return { message: `Sensor not found serial: ${serial}` };

      // Mark sensor as online and update lastSeenAt
      sensor.isOnline = true;
      sensor.lastSeenAt = new Date();

      // Validate software version
      const software = await this.softwareRepository.findOne({ where: { version: softwareVersion } });

      if (software) {
        sensor.currentSoftware = software;
        sensor.currentSoftwareId = software.id;
        await this.sensorRepository.save(sensor);
        return { message: `Sensor updated to version: ${softwareVersion}` };
      } else {
        // Only update online status and lastSeenAt
        await this.sensorRepository.save(sensor);
        return { message: `Sensor online; invalid version: ${softwareVersion}` };
      }
    } catch (err) {
      this.logger.error('Error handling device status:', err);
      return { message: 'Error handling device status' };
    }
  }
}
