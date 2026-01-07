import { Router } from 'express';
import { uploadMulti, asyncHandler } from '@middlewares';
import { uploadImages } from '@controllers';

const imageRouter = Router();

imageRouter.post('/', uploadMulti, asyncHandler(uploadImages));

export default imageRouter;
