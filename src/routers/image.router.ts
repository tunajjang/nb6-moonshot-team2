import { Router } from 'express';
import { uploadMulti } from '../middlewares/imageUpload.middleware';
import { uploadImages } from '../controllers/image.controller';
import { withAsync } from '../lib/withAsync';

const imageRouter = Router();

imageRouter.post('/', uploadMulti, withAsync(uploadImages));

export default imageRouter;