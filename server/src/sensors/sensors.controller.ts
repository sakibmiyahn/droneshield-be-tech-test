import { Controller, Get, Query } from '@nestjs/common';
import { GetSensorsDto } from './dto/get-sensors.dto';
import { SensorsService } from './sensors.service';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get()
  async getSensors(@Query() query: GetSensorsDto) {
    return this.sensorsService.getSensors(query);
  }
}
