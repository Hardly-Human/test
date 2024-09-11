import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Image } from './models/Image'; 
import { User } from './models/User';   
import { Comment } from './models/Comment';
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
  entities: [User,Image,Comment],
  migrations: [],
  subscribers: [],
});
