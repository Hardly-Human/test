import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Image } from '../models/Image';

// Route to display image details and comments
export const ImageDetailsHandler = async (req: Request, res: Response) => {
  const imageRepo = AppDataSource.getRepository(Image);
  const { shortUrl } = req.params;

  try {
    // Fetch image along with the user and comments, including the user for each comment
    const image = await imageRepo.findOne({
      where: { shortUrl },
      relations: ['user', 'comments', 'comments.user'],
    });

    if (image) {
      res.render('image-details', { image, user: req.oidc.user, req });
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error('Error fetching image details:', error);
    res.status(500).send('Internal server error');
  }
}

// Route to access image via short URL
export const ImageDetailsViewer = async (req: Request, res: Response) => {
  const imageRepo = AppDataSource.getRepository(Image);
  const { shortUrl } = req.params;

  try {
    // Find the image by short URL
    const image = await imageRepo.findOne({ where: { shortUrl } });

    if (image) {
      // Redirect to the image URL (S3 link)
      res.redirect(image.url);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error('Error fetching image by short URL:', error);
    res.status(500).send('Internal server error');
  }
}

