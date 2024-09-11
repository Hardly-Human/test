import { Router } from 'express';
import { ensureUserExists } from '../middlewares/userCheck';

import { DisplayUserHomePage } from "../controllers/handleUserHome";
import { DisplayLogInPage, DisplaySignUpPage } from "../controllers/handleAuth"
import { DisplayUserProfilePage } from "../controllers/handleUserProfile"

const router = Router();

// Home page (Display gallery)
router.get('/', DisplayUserHomePage);

// Signup Route (Force Auth0 to show signup page)
router.get('/signup', DisplaySignUpPage);

// Login Route (No DB interaction, just redirect)
router.get('/login', DisplayLogInPage);

// User Profile Page
router.get('/profile',ensureUserExists, DisplayUserProfilePage);

export default router;
