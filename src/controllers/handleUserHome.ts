import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Image } from '../models/Image';


// Home page (Display gallery)
export const DisplayUserHomePage = async (req: Request, res: Response) => {
  const imageRepo = AppDataSource.getRepository(Image);
  const page = parseInt(req.query.page as string, 10) || 1;  // Current page
  const pageSize = 5;  // Number of images per page

  // Fetch images with pagination
  const [images, totalImages] = await imageRepo.findAndCount({
    take: pageSize,
    skip: (page - 1) * pageSize,
    order: { createdAt: 'DESC' }  // Order by most recent first
  });

  const totalPages = Math.ceil(totalImages / pageSize);

  res.render('index', {
    images,
    currentPage: page,
    totalPages,
    user: req.oidc.user  // Pass the authenticated user
  });
}


