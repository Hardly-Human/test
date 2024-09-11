import { Router } from 'express';
import { ensureUserExists } from '../middleware/ensureUserExists';  // Import the middleware

const router = Router();

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Image Sharing Platform', user: req.oidc.user });
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
