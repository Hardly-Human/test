import { Router } from 'express';

const router = Router();

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Image Sharing Platform', user: req.oidc.user });
});

// Profile page
router.get('/profile', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.render('profile', { user: req.oidc.user });
  } else {
    res.redirect('/');
  }
});

export default router;
