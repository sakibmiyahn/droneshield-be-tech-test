import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException, Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Software } from '../entities/software.entity';
import { SoftwareResponse } from '../common/interfaces';

@Injectable()
export class SoftwareService {
  private readonly logger = new Logger(SoftwareService.name);
  private readonly uploadsDir: string;

  constructor(
    @InjectRepository(Software)
    private readonly softwareRepository: Repository<Software>,
  ) {
    this.uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
  }

  async handleUpload(files: Express.Multer.File[]) {
    try {
      // Ensure uploads directory exists
      fs.mkdirSync(this.uploadsDir, { recursive: true });
      const results: SoftwareResponse[] = [];

      for (const file of files) {
        this.logger.log(`Processing file: ${file.originalname}`);

        if (file.mimetype !== 'application/pdf' || !file.originalname.endsWith('.pdf')) {
          throw new BadRequestException(`File ${file.originalname} is not a valid PDF.`);
        }

        const version = this.extractVersion(file.originalname);

        if (!version || !this.isValidSemver(version)) {
          throw new BadRequestException(`File ${file.originalname} does not have a valid semantic version.`);
        }

        // Check for duplicate version
        const existing = await this.softwareRepository.findOne({ where: { version } });

        if (existing) {
          throw new BadRequestException(`Software version ${version} already exists.`);
        }

        // Save file to uploads dir
        const filePath = path.join(this.uploadsDir, file.originalname);

        try {
          await fs.promises.writeFile(filePath, file.buffer);
        } catch (fileErr) {
          throw new InternalServerErrorException(`Failed to save file ${file.originalname}`);
        }

        // Save metadata in DB
        try {
          const software = this.softwareRepository.create({
            version,
            filePath: path.relative(process.cwd(), filePath),
            originalFileName: file.originalname,
          });

          const saved = await this.softwareRepository.save(software);
          results.push(saved.toResponse());
          this.logger.log(`Software version ${version} uploaded and saved.`);
        } catch (dbErr) {
          throw new InternalServerErrorException(`Failed to save software metadata for ${file.originalname}`);
        }
      }

      return results;
    } catch (err) {
      this.logger.error('Error in handleUpload:', err.message || err.stack);

      if (err instanceof BadRequestException || err instanceof InternalServerErrorException) throw err;

      throw new InternalServerErrorException('An unexpected error occurred during file upload.');
    }
  }

  private extractVersion(filename: string): string | null {
    const match = filename.match(/software_v([\d.]+)\.pdf$/i);
    return match ? match[1] : null;
  }

  private isValidSemver(version: string): boolean {
    // Simple semver regex: 1.2.3 or 1.2.3-beta
    return /^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version);
  }
}
