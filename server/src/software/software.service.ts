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
        this.logger.log(`Processing file: ${file.originalname}`);

        this.validateFile(file);

        const version = this.extractVersion(file.originalname);

        if (!version || !this.isValidSemver(version)) {
          throw new BadRequestException(`File ${file.originalname} does not have a valid semantic version.`);
        }

        const exists = await this.softwareRepository.exists({ where: { version } });

        if (exists) {
          throw new BadRequestException(`Software version ${version} already exists.`);
        }

        const filePath = path.resolve(this.uploadsDir, file.originalname);
        await fs.promises.writeFile(filePath, file.buffer);

        const software = this.softwareRepository.create({
          version,
          filePath: path.relative(process.cwd(), filePath),
          originalFileName: file.originalname,
        });

        await this.softwareRepository.save(software);
        this.logger.log(`Saved software version ${version}`);
      }

      return { success: true, message: 'Software uploaded successfully.' };
    } catch (err: any) {
      this.logger.error(`Upload error: ${err?.message || err}`);

      if (err instanceof BadRequestException || err instanceof InternalServerErrorException) {
        return { success: false, message: err.message };
      }

      throw new InternalServerErrorException('Unexpected error during upload.');
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (file.mimetype !== 'application/pdf' || !file.originalname.endsWith('.pdf')) {
      throw new BadRequestException(`Invalid file type: ${file.originalname}`);
    }
  }

  private extractVersion(filename: string): string | null {
    const match = filename.match(/software_v([\d.]+)\.pdf$/i);
    return match?.[1] || null;
  }

  private isValidSemver(version: string): boolean {
    return /^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version);
  }
}
