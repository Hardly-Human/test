import { Router } from 'express';
import upload from '../middlewares/multer';
import { AppDataSource } from '../data-source';
import { Image } from '../models/Image';

import { ensureUserExists } from '../middlewares/userCheck';
import { ImageCommentHandler } from "../controllers/handleImageComment";
import { ImageDeleteHandler } from "../controllers/handleImageDelete";
import { ImageDetailsHandler, ImageDetailsViewer } from "../controllers/handleImageDetails";
import { ImageUpdateHandler, DisplayImageUpdatePage } from "../controllers/handleImageUpdates";
import { ImageUploadHandler, DisplayImageUploadPage } from "../controllers/handleImageUpload";

const router = Router();

// Route to render the upload form
router.get('/upload', ensureUserExists, DisplayImageUploadPage);

// Route to handle image upload
router.post('/upload', ensureUserExists, upload.single('image'), ImageUploadHandler);

// Route to access image via short URL
router.get('/:shortUrl', ImageDetailsViewer);

// Route to display image details and comments
router.get('/:shortUrl/details', ImageDetailsHandler);

// Route to handle adding comments to an image
router.post('/:shortUrl/comments', ImageCommentHandler);

// Route to handle deleting an image
router.post('/:shortUrl/delete', ImageDeleteHandler);

// Route to display the update metadata form
router.get('/:shortUrl/update', DisplayImageUpdatePage);

// Route to handle updating image metadata
router.post('/:shortUrl/update', ImageUpdateHandler);

export default router;
