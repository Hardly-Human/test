import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Image } from './entity/Image';  // Import your entities
import { User } from './entity/User';    // Import your entities
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User,Image],
  migrations: [],
  subscribers: [],
});
