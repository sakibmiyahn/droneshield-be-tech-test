import { DeviceStatusDto } from './dto/device-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { SensorSoftwareHistory } from '../entities/sensor-software-history.entity';
import { Software } from '../entities/software.entity';
import { StatusAck } from '../types/interfaces';

@Injectable()
export class GrpcService {
  private readonly logger = new Logger(GrpcService.name);

  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
    @InjectRepository(Software)
    private readonly softwareRepository: Repository<Software>,
    @InjectRepository(SensorSoftwareHistory)
    private readonly sensorSoftwareHistoryRepository: Repository<SensorSoftwareHistory>,
  ) {}

  async processDeviceStatus(payload: DeviceStatusDto): Promise<StatusAck> {
    try {
      const { serial, softwareVersion } = payload;
      this.logger.log(`processDeviceStatus - serial: ${serial}, version: ${softwareVersion}`);

      const sensor = await this.sensorRepository.findOne({ where: { serial } });

      if (!sensor) return { message: `Sensor not found: ${serial}` };

      const software = await this.softwareRepository.findOne({ where: { version: softwareVersion } });

      // Update basic status
      sensor.isOnline = true;
      sensor.lastSeenAt = new Date();

      if (!software) {
        await this.sensorRepository.save(sensor);
        return { message: `Sensor marked online; unknown version: ${softwareVersion}` };
      }

      // Track history if version changed
      if (sensor.softwareId !== software.id) {
        if (sensor.softwareId) {
          await this.sensorSoftwareHistoryRepository.save(
            this.sensorSoftwareHistoryRepository.create({
              sensor,
              software: { id: sensor.softwareId } as Software,
            }),
          );

          this.logger.log(`History recorded - serial: ${serial}, previous version ID: ${sensor.softwareId}`);
        }

        sensor.software = software;
        sensor.softwareId = software.id;

        this.logger.log(`Sensor updated - serial: ${serial}, new version: ${softwareVersion}`);
      }

      await this.sensorRepository.save(sensor);
      return { message: `Sensor status updated - version: ${softwareVersion}` };
    } catch (err) {
      this.logger.error('Error processing status:', err);
      return { message: 'Internal error processing device status' };
    }
  }
}
