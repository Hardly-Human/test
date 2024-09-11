import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { ensureUserExists } from '../middleware/ensureUserExists';  // Import the middleware
import { Image } from '../entity/Image';
import { User } from '../entity/User';


const router = Router();

// Home page (Display gallery)
router.get('/', async (req, res) => {
  const imageRepo = AppDataSource.getRepository(Image);
  const page = parseInt(req.query.page as string, 10) || 1;  // Current page
  const pageSize = 5;  // Number of images per page

  // Fetch images with pagination
  const [images, totalImages] = await imageRepo.findAndCount({
    take: pageSize,
    skip: (page - 1) * pageSize,
    order: { createdAt: 'DESC' }  // Order by most recent first
  });

  const totalPages = Math.ceil(totalImages / pageSize);

  res.render('index', {
    images,
    currentPage: page,
    totalPages,
    user: req.oidc.user  // Pass the authenticated user
  });
});

// Signup Route (Force Auth0 to show signup page)
router.get('/signup', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.redirect('/profile');
  } else {
    // Force Auth0 to show the signup page with screen_hint=signup
    res.oidc.login({
      authorizationParams: {
        screen_hint: 'signup'
      }
    });
  }
});

// Login Route (No DB interaction, just redirect)
router.get('/login', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.oidc.login();  // Redirect to Auth0 login page
  }
});



// Route to access image via short URL
router.get('/i/:shortUrl', async (req, res) => {  
  const imageRepo = AppDataSource.getRepository(Image);
  const { shortUrl } = req.params;

  try {
    // Find the image by short URL
    const image = await imageRepo.findOne({ where: { shortUrl } });

    if (image) {
      // Redirect to the image URL (S3 link)
      res.redirect(image.url);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error('Error fetching image by short URL:', error);
    res.status(500).send('Internal server error');
  }
});


// User Profile Page
router.get('/profile',ensureUserExists, async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const imageRepo = AppDataSource.getRepository(Image);
  const auth0User = req.oidc.user;

  try {
    // Find the user in the database using their Auth0 ID
    const user = await userRepo.findOne({ where: { auth0Id: auth0User?.sub }, relations: ['images'] });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Fetch the user's uploaded images
    const userImages = await imageRepo.find({ where: { user: user } });

    // Render the profile page with the user's images
    res.render('profile', { user, images: userImages });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Internal server error');
  }
});

export default router;
