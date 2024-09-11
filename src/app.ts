import 'reflect-metadata';
import express from 'express';
import path from 'path';
import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';
import indexRoutes from './routes/index';  // Import index routes
import imageRoutes from './routes/imageRoutes';  // Import image-related routes
import { AppDataSource } from './data-source';  // Import the data source

dotenv.config();

const app = express();

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use(express.static('public'));

// Add body parsing middleware
app.use(express.urlencoded({ extended: true }));  // To parse URL-encoded form data
app.use(express.json());  // To parse JSON request bodies (if needed)


// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

// Initialize the Auth0 middleware
app.use(auth(config));

// Define routes
app.use('/', indexRoutes);  // Mount the index routes at the root path
app.use('/images', imageRoutes);  // Mount the image-related routes under /images

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
