import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Image } from '../models/Image';


// Route to handle deleting an image
export const ImageDeleteHandler = async (req: Request, res: Response) => {
  const { shortUrl } = req.params;
  const imageRepo = AppDataSource.getRepository(Image);
  const auth0User = req.oidc.user;

  try {
    // Find the image by short URL and ensure it belongs to the logged-in user
    const image = await imageRepo.findOne({ where: { shortUrl }, relations: ['user'] });

    if (!image || image.user.auth0Id !== auth0User?.sub) {
      return res.status(403).send('You do not have permission to delete this image');
    }

    // Delete the image
    await imageRepo.remove(image);

    res.redirect('/profile');
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).send('Internal server error');
  }
}


