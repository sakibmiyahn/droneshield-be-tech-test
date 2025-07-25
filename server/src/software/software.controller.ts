import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SoftwareService } from './software.service';

@Controller('upload')
export class SoftwareController {
  constructor(private readonly softwareService: SoftwareService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadSoftware(@UploadedFiles() files: Array<Express.Multer.File>) {
    try {
      if (!files || files.length === 0) return { success: false, message: 'No files provided' };

      return this.softwareService.handleUpload(files);
    } catch (err) {
      return {
        success: false,
        message: err?.message || 'Unexpected error during upload',
      };
    }
  }
}
