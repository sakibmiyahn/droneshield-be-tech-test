import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

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
}
