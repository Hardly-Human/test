import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Image } from '../models/Image';
import { nanoid } from 'nanoid'; 

const CLOUD_FRONT_DOMAIN = process.env.CLOUD_FRONT_DOMAIN;

export const DisplayImageUploadPage = (req: Request, res: Response) => {
  if (req.oidc.isAuthenticated()) {
    res.render('upload');
  } else {
    res.redirect('/login');
  }
}

// Handle the file upload and save metadata to the database
export const ImageUploadHandler = async (req: Request, res: Response) => {
  const file = req.file as Express.MulterS3.File;
  
  if (file) {
    // Generate the CloudFront URL using the S3 key and CloudFront domain
    const cloudFrontUrl = `https://${CLOUD_FRONT_DOMAIN}/${file.key}`;
    const imageRepo = AppDataSource.getRepository(Image);
    const { title, description } = req.body;
    const user = (req as any).user; 

    try {
      // Generate a short URL using nanoid
      const shortUrl = nanoid(7);  // Generate a 7-character short URL

      // Create and save image metadata
      const image = new Image();
      image.url = cloudFrontUrl;
      image.key = file.key;
      image.createdAt = new Date();
      image.shortUrl = shortUrl; 
      image.user = user;  
      image.title = title;
      image.description = description;

      await imageRepo.save(image);

      res.redirect('/profile');
    } catch (error) {
      console.error('Error saving image metadata:', error);
      res.status(500).send('Failed to save image metadata.');
    }
  } else {
    res.status(400).send('Failed to upload image.');
  }
};
