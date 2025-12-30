import { StatusCodes } from 'http-status-codes';
import { BaseError } from '@lib';

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

