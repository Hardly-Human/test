import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { ensureUserExists } from '../middleware/ensureUserExists';  // Import the middleware
import { Image } from '../entity/Image';

const router = Router();

// Home page (Display gallery)
router.get('/', async (req, res) => {
  const imageRepo = AppDataSource.getRepository(Image);
  const page = parseInt(req.query.page as string, 10) || 1;  // Current page
  const pageSize = 10;  // Number of images per page

  // Fetch images with pagination
  const [images, totalImages] = await imageRepo.findAndCount({
    take: pageSize,
    skip: (page - 1) * pageSize,
    order: { createdAt: 'DESC' }  // Order by most recent first
  });

  const totalPages = Math.ceil(totalImages / pageSize);

  res.render('gallery', {
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

// Handle Signup Callback: After successful signup, ensure the user exists in the DB
router.get('/profile', ensureUserExists, (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.render('profile', { user: req.oidc.user });
  } else {
    res.redirect('/login');
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

export default router;
