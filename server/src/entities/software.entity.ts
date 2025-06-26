import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { SoftwareResponse } from '../common/interfaces';

@Entity()
export class Software {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  version: string;

  @Column()
  filePath: string;

  @Column()
  originalFileName: string;

  @CreateDateColumn()
  uploadedAt: Date;

  toResponse(): SoftwareResponse {
    return {
      id: this.id,
      version: this.version,
      filePath: this.filePath,
      originalFileName: this.originalFileName,
      uploadedAt: this.uploadedAt,
    };
  }
}
