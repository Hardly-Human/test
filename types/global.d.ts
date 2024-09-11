import { User } from '../src/entity/User';  // Adjust the import path based on your project structure

declare global {
  namespace Express {
    interface Request {
      user?: User;  // Extend Express Request to include user property
    }
  }
}
