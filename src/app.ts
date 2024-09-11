import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { auth } from 'express-openid-connect';
import  AuthConfig from "./config/auth"
import indexRoutes from './routes/user';  
import imageRoutes from './routes/image';  
import { AppDataSource } from './data-source';

dotenv.config();

const app = express();

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use(express.static('public'));

// Add body parsing middleware
app.use(express.urlencoded({ extended: true }));  // To parse URL-encoded form data
app.use(express.json()); 


// Initialize the Auth0 middleware
app.use(auth(AuthConfig));

// Define routes
app.use('/', indexRoutes); 
app.use('/images', imageRoutes);  
app.use((req, res) => {
  res.status(404).render('404'); 
});

// Initialize the database connection and start the server
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection initialized');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization', error);
  });
