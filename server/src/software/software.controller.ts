import { BadRequestException, Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SoftwareService } from './software.service';

@Controller('upload')
export class SoftwareController {
  constructor(private readonly softwareService: SoftwareService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadSoftware(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) throw new BadRequestException('No files uploaded');

    return this.softwareService.handleUpload(files);
  }
}
