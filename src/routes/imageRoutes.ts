import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController';
import upload from '../middleware/multer';
import { ensureUserExists } from '../middleware/ensureUserExists';
import { AppDataSource } from '../data-source';
import { Image } from '../entity/Image';


const router = Router();

// Route to render the upload form (protected route)
router.get('/upload', ensureUserExists, (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.render('upload');
  } else {
    res.redirect('/login');
  }
});

// Route to handle image upload
router.post('/upload', ensureUserExists, upload.single('image'), uploadImage);

export default router;
