import ormconfig from './ormconfig';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource(ormconfig);
