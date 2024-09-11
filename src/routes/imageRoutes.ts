import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController';
import upload from '../middleware/multer';

const router = Router();

// Route to render the upload form
router.get('/upload', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.render('upload');
  } else {
    res.redirect('/login');
  }
});

// Route to handle image upload
router.post('/upload', upload.single('image'), uploadImage);

export default router;
