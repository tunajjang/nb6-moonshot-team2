import { StatusCodes } from 'http-status-codes';
import { BaseError } from './baseError';

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, message);
  }
}
