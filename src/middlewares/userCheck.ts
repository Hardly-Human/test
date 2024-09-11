import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source'; 
import { User } from '../models/User';

export const ensureUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const userRepo = AppDataSource.getRepository(User); 
  const auth0Id = req.oidc.user?.sub;
  const email = req.oidc.user?.email;

  if (!auth0Id || !email) {
    return next();
  }

  let user = await userRepo.findOne({ where: { auth0Id } });

  if (!user) {
    user = new User();
    user.auth0Id = auth0Id;
    user.email = email;
    user.name = req.oidc.user?.name;
    user.profilePicture = req.oidc.user?.picture;
    await userRepo.save(user);
  }

  (req as any).user = user;
  next();
};
