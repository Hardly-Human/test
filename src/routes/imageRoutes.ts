import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController';
import upload from '../middleware/multer';
import { ensureUserExists } from '../middleware/ensureUserExists';
import { AppDataSource } from '../data-source';
import { Image } from '../entity/Image';
import { User } from '../entity/User';

import { Comment } from '../entity/Comment';

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

// Route to display image details and comments
router.get('/:shortUrl/details', async (req, res) => {
  const imageRepo = AppDataSource.getRepository(Image);
  const { shortUrl } = req.params;

  try {
    // Fetch image along with the user and comments, including the user for each comment
    const image = await imageRepo.findOne({
      where: { shortUrl },
      relations: ['user', 'comments', 'comments.user'],  // Ensure 'comments.user' is loaded
    });

    if (image) {
      res.render('image-details', { image, user: req.oidc.user });
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error('Error fetching image details:', error);
    res.status(500).send('Internal server error');
  }
});



// Route to handle adding comments to an image
router.post('/:shortUrl/comments', async (req, res) => {
  const { shortUrl } = req.params;
  const { commentText } = req.body;
  const imageRepo = AppDataSource.getRepository(Image);
  const commentRepo = AppDataSource.getRepository(Comment);
  const userRepo = AppDataSource.getRepository(User);  // Get the user repository
  const auth0User = req.oidc.user;  // Use Auth0 user from req.oidc

  try {
    // Find the image by short URL
    const image = await imageRepo.findOne({ where: { shortUrl } });

    if (!image) {
      return res.status(404).send('Image not found');
    }

    // Find or create the user in the database based on Auth0 user data
    let user = await userRepo.findOne({ where: { auth0Id: auth0User?.sub } });
    
    if (!user) {
      // If the user doesn't exist in the database, create a new one
      user = new User();
      user.auth0Id = auth0User?.sub;
      user.email = auth0User?.email;
      user.name = auth0User?.name;
      await userRepo.save(user);
    }

    // Create a new comment
    const comment = new Comment();
    comment.text = commentText;
    comment.image = image;
    comment.user = user;  // Associate the user with the comment

    // Save the comment
    await commentRepo.save(comment);

    // Redirect back to the image details page
    res.redirect(`/images/${shortUrl}/details`);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Internal server error');
  }
});

export default router;
