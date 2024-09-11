import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Image } from '../entity/Image';
import { User } from '../entity/User';

// Handle the file upload and save metadata to the database
export const uploadImage = async (req: Request, res: Response) => {
  const file = req.file as Express.MulterS3.File;
  
  if (file) {
    const s3Url = `https://${file.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`;

    try {
      // Get the user from Auth0 and find the corresponding User entity
      const userRepo = getRepository(User);
      const user = await userRepo.findOne({ where: { email: req?.oidc?.user?.email } });

      if (!user) {
        return res.status(404).send('User not found');
      }

      // Create the image metadata entry
      const imageRepo = getRepository(Image);
      const image = new Image();
      image.url = s3Url;
      image.key = file.key;
      image.createdAt = new Date();
      image.user = user;  // Associate image with the user

      await imageRepo.save(image);

      res.send(`File uploaded successfully. Image URL: ${s3Url}`);
    } catch (error) {
      console.error('Error saving image metadata:', error);
      res.status(500).send('Failed to save image metadata.');
    }
  } else {
    res.status(400).send('Failed to upload image.');
  }
};
