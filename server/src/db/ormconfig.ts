import { DataSourceOptions } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { SensorSoftwareHistory } from '../entities/sensor-software-history.entity';
import { Software } from '../entities/software.entity';

const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
  entities: [Sensor, Software, SensorSoftwareHistory],
  synchronize: true, // Set to false in production
};

export default ormconfig;
