import { Request, Response, NextFunction } from 'express';
import { Struct, assert } from 'superstruct';
import { StatusCodes } from 'http-status-codes';

export const validate = (struct: Struct<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      assert(req.body, struct);
      next();
    } catch (e) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: '잘못된 데이터 형식' });
    }
  };
};
