import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Image } from '../models/Image';


// Route to display the update metadata form
export const DisplayImageUpdatePage = async (req:Request, res:Response) => {
  const { shortUrl } = req.params;
  const imageRepo = AppDataSource.getRepository(Image);
  const auth0User = req.oidc.user;

  try {
    // Find the image by short URL and ensure it belongs to the logged-in user
    const image = await imageRepo.findOne({ where: { shortUrl }, relations: ['user'] });

    if (!image || image.user.auth0Id !== auth0User?.sub) {
      return res.status(403).send('You do not have permission to update this image');
    }

    res.render('update-image', { image });
  } catch (error) {
    console.error('Error fetching image for update:', error);
    res.status(500).send('Internal server error');
  }
}

// Route to handle updating image metadata
export const ImageUpdateHandler = async (req:Request, res:Response) => {
  const { shortUrl } = req.params;
  const { title, description } = req.body;
  const imageRepo = AppDataSource.getRepository(Image);
  const auth0User = req.oidc.user;

  try {
    // Find the image by short URL and ensure it belongs to the logged-in user
    const image = await imageRepo.findOne({ where: { shortUrl }, relations: ['user'] });

    if (!image || image.user.auth0Id !== auth0User?.sub) {
      return res.status(403).send('You do not have permission to update this image');
    }

    // Update image metadata
    image.title = title;
    image.description = description;

    await imageRepo.save(image);

    res.redirect('/profile');
  } catch (error) {
    console.error('Error updating image metadata:', error);
    res.status(500).send('Internal server error');
  }
}