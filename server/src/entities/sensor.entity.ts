import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SensorResponse } from '../common/interfaces';
import { Software } from './software.entity';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  serial: string;

  @Index()
  @Column({ default: false })
  isOnline: boolean;

  @ManyToOne(() => Software, { nullable: true, cascade: false })
  @JoinColumn({ name: 'currentSoftwareId' })
  currentSoftware: Software;

  @Column({ nullable: true })
  currentSoftwareId: number;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  lastSeenAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toResponse(): SensorResponse {
    return {
      id: this.id,
      serial: this.serial,
      version: this.currentSoftware ? this.currentSoftware.version : null,
      isOnline: this.isOnline,
      lastSeenAt: this.lastSeenAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
