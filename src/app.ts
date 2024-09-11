import 'reflect-metadata';
import express from 'express';
import path from 'path';
import routes from './routes';
import { AppDataSource } from './data-source';
import dotenv from 'dotenv';

// Initialize dotenv to use environment variables
dotenv.config();

// Initialize the data source
AppDataSource.initialize().then(() => {
  console.log('Connected to the database');

  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));
  app.use(express.static(path.join(__dirname, '../public')));

  // Parse JSON and form data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Define routes
  app.use(routes);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => console.log('Error connecting to the database: ', error));
