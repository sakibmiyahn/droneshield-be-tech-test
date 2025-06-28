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
import { SensorResponse } from '../types/interfaces';
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
  @JoinColumn({ name: 'softwareId' })
  software: Software;

  @Column({ nullable: true })
  softwareId: number;

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
      version: this.software ? this.software.version : null,
      isOnline: this.isOnline,
    };
  }
}
