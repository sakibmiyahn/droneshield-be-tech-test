import { IsString } from 'class-validator';

export class DeviceStatusDto {
  @IsString()
  serial: string;

  @IsString()
  softwareVersion: string;
}
