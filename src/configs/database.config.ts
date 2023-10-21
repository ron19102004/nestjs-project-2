/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import envc from './environment.config';
import { Admin, Branch, Department } from 'src/modules';
interface IConfigsDatabase {
  HOST: string;
  PORT: number;
  USERNAME: string;
  PASSWORD: string;
  DATABASE: string;
}
const configDatabase: IConfigsDatabase = envc().DATABASE as IConfigsDatabase;
export default {
  type: 'postgres',
  host: configDatabase.HOST,
  port: configDatabase.PORT,
  username: configDatabase.USERNAME,
  password: configDatabase.PASSWORD,
  database: configDatabase.DATABASE,
  synchronize: true,
  logging: false,
  entities: [Admin, Branch, Department],
  subscribers: [],
  migrations: [],
} as TypeOrmModuleOptions;
