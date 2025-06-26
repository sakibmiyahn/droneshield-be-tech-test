import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sensor } from './sensor.entity';
import { Software } from './software.entity';

@Entity()
export class SensorSoftwareHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sensor, { cascade: false })
  sensor: Sensor;

  @ManyToOne(() => Software, { cascade: false })
  software: Software;

  @CreateDateColumn()
  reportedAt: Date;
}
