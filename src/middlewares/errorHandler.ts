import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseError } from '@/lib';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);

  if (error instanceof BaseError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
};

// export default errorHandler;
