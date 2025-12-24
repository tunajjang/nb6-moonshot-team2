import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services/userService';

export class UserController {
  constructor(private userService: UserService) {}

  public getUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid user Id' });
      return;
    }

    const user = await this.userService.getUserById(userId);
    return res.status(StatusCodes.OK).json(user);
  };
}
