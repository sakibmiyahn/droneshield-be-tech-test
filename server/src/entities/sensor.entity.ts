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
import { Software } from './software.entity';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  serial: string;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  lastSeenAt: Date;

  @Index()
  @Column({ default: false })
  isOnline: boolean;

  @ManyToOne(() => Software, { nullable: true, cascade: false })
  @JoinColumn({ name: 'currentSoftwareId' })
  currentSoftware: Software;

  @Column({ nullable: true })
  currentSoftwareId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
