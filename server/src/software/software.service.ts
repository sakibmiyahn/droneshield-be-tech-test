import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Software } from '../entities/software.entity';

@Injectable()
export class SoftwareService {
  private readonly logger = new Logger(SoftwareService.name);
  private readonly uploadsDir = process.env.UPLOADS_DIR || path.resolve('uploads');

  constructor(
    @InjectRepository(Software)
    private readonly softwareRepository: Repository<Software>,
  ) {}

  async handleUpload(files: Express.Multer.File[]) {
    try {
      await fs.promises.mkdir(this.uploadsDir, { recursive: true });

      for (const file of files) {
        const { originalname } = file;

        this.logger.log(`handleUpload:file: ${originalname}`);

        this.validateFile(file);

        const version = this.extractVersion(originalname);

        if (!version || !this.isValidSemver(version)) {
          throw new BadRequestException(`File ${originalname} does not have a valid semantic version`);
        }

        const exists = await this.softwareRepository.exists({ where: { version } });

        if (exists) throw new BadRequestException(`Software version: ${version} already exists`);

        const filePath = path.resolve(this.uploadsDir, originalname);
        await fs.promises.writeFile(filePath, file.buffer);

        const software = this.softwareRepository.create({
          version,
          filePath: path.relative(process.cwd(), filePath),
          originalFileName: originalname,
        });

        await this.softwareRepository.save(software);
        this.logger.log(`handleUpload: uploaded software version: ${version}`);
      }

      return { success: true, message: 'Software uploaded successfully' };
    } catch (err: any) {
      this.logger.error(`handleUpload:error: ${err?.message || err}`);

      if (err instanceof BadRequestException || err instanceof InternalServerErrorException) {
        return { success: false, message: err.message };
      }

      throw new InternalServerErrorException('Unexpected error during upload');
    }
  }

  // Validates the uploaded file to ensure it is a PDF
  private validateFile(file: Express.Multer.File): void {
    if (file.mimetype !== 'application/pdf' || !file.originalname.endsWith('.pdf')) {
      throw new BadRequestException(`Invalid file type: ${file.originalname}`);
    }
  }

  // Extracts the version from the filename using regex
  private extractVersion(filename: string): string | null {
    // Match both v-prefixed and non-v-prefixed versions
    const match = filename.match(/software_((v)?\d+\.\d+\.\d+(?:-[\w.]+)?)\.pdf$/i);
    return match?.[1] || null;
  }

  // Validates if the version string is a valid semantic version
  private isValidSemver(version: string): boolean {
    // Allow optional 'v' prefix
    return /^(v)?\d+\.\d+\.\d+(-[\w.]+)?$/.test(version);
  }
}
