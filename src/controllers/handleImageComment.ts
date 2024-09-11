import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Image } from '../models/Image';
import { User } from '../models/User';

import { Comment } from '../models/Comment';

export const ImageCommentHandler = async (req: Request, res: Response) => {
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
}
