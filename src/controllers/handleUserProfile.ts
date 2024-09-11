import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Image } from '../models/Image';
import { User } from '../models/User';

// User Profile Page
export const DisplayUserProfilePage = async (req: Request, res: Response) => {
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
}

