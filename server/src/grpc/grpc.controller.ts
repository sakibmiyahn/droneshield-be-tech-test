import { Controller } from '@nestjs/common';
import { DeviceStatusDto } from './dto/device-status.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcService } from './grpc.service';
import { StatusAck } from '../common/interfaces';

@Controller()
export class GrpcController {
  constructor(private readonly grpcService: GrpcService) {}

  @GrpcMethod('DeviceStatusService', 'SendStatus')
  async sendStatus(payload: DeviceStatusDto): Promise<StatusAck> {
    return this.grpcService.processDeviceStatus(payload);
  }
}
