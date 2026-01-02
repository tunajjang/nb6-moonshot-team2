import { is } from 'superstruct';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EmailStruct } from '@superstructs';
import { UserService } from '@services';
import { AuthRequest } from '@middlewares';

export class UserController {
  constructor(private userService: UserService) {}

  public verifyPassword = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id as number;
    const { password } = req.body;

    await this.userService.verifyPassword(userId, password);
    return res.status(StatusCodes.OK).json({ message: 'Password verified successfully!' });
  };

  public getUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid user Id' });
      return;
    }

    const user = await this.userService.getUserById(userId);
    return res.status(StatusCodes.OK).json(user);
  };

  public getMe = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id as number;
    const user = await this.userService.getUserById(userId);
    return res.status(StatusCodes.OK).json(user);
  };

  public updateUser = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id as number;
    const userData = req.body;
    const updatedUser = await this.userService.updateUser(userId, userData);
    return res.status(StatusCodes.OK).json(updatedUser);
  };

  public findUsers = async (req: Request, res: Response) => {
    const users = await this.userService.findUsers();
    return res.status(StatusCodes.OK).json(users);
  };

  public deleteUser = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id as number;
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

  public getMyProjects = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id as number;
    const projects = await this.userService.getMyProjects(userId);
    return res.status(StatusCodes.OK).json(projects);
  };

  public getMyTasks = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id as number;
    const tasks = await this.userService.getMyTasks(userId);
    return res.status(StatusCodes.OK).json(tasks);
  };
}
