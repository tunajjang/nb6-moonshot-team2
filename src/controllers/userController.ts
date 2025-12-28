import { is } from 'superstruct';
import { EmailStruct } from '@superstructs';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '@services';

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

  public updateUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const userData = req.body;

    const updatedUser = await this.userService.updateUser(userId, userData);

    return res.status(StatusCodes.OK).json(updatedUser);
  };

  public findUsers = async (req: Request, res: Response) => {
    const users = await this.userService.findUsers();
    return res.status(StatusCodes.OK).json(users);
  };

  public deleteUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const deletedUser = await this.userService.deleteUser(userId);
    return res.status(StatusCodes.OK).json(deletedUser);
  };

  public findUserByEmail = async (req: Request, res: Response) => {
    const email = req.query.email as string;

    if (!is(email, EmailStruct)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email is required' });
      return;
    }
    const user = await this.userService.findUserByEmail(email);
    return res.status(StatusCodes.OK).json(user);
  };
}
