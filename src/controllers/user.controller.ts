import { is } from 'superstruct';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EmailStruct } from '@superstructs';
import { UserService } from '@services';
import { AuthRequest } from '@middlewares';

export class UserController {
  constructor(private userService: UserService) {}

  // 비밀번호 검증
  public verifyPassword = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id as number;
    const { password } = req.body;

    await this.userService.verifyPassword(userId, password);
    return res.status(StatusCodes.OK).json({ message: 'Password verified successfully!' });
  };

  // ID로 찾기
  public getUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid user Id' });
      return;
    }

    const { password, ...userData } = await this.userService.getUserById(userId);
    return res.status(StatusCodes.OK).json(userData);
  };

  // 내정보 찾기
  public getMe = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id as number;
    const { password, ...userData } = await this.userService.getUserById(userId);
    return res.status(StatusCodes.OK).json(userData);
  };

  // 내정보 수정
  public updateUser = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id as number;
    const { password, ...userData } = await this.userService.updateUser(userId, req.body);
    return res.status(StatusCodes.OK).json(userData);
  };

  // 비밀번호 수정
  public updatePassword = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id as number;
    await this.userService.updatePassword(userId, req.body.password);
    return res.status(StatusCodes.OK).json({ message: '비밀번호가 변경되었습니다.' });
  };

  // 사용자 찾기
  public findUsers = async (req: Request, res: Response) => {
    const users = await this.userService.findUsers();
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userData } = user;
      return userData;
    });
    return res.status(StatusCodes.OK).json(usersWithoutPassword);
  };

  // 사용자 삭제
  public deleteUser = async (req: AuthRequest, res: Response) => {
    await this.userService.deleteUser(req.user?.id as number);
    return res.status(StatusCodes.OK).json({ message: '사용자를 삭제했습니다.' });
  };

  // EMAIL로 찾기
  public findUserByEmail = async (req: Request, res: Response) => {
    const email = req.query.email as string;
    if (!is(email, EmailStruct)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email is required' });
      return;
    }
    const { password, ...userData } = await this.userService.findUserByEmail(email);
    return res.status(StatusCodes.OK).json(userData);
  };

  // 내 프로젝트 목록 보기
  public getMyProjects = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id as number;
    const projects = await this.userService.getMyProjects(userId);
    return res.status(StatusCodes.OK).json(projects);
  };

  // 내 할일 목록 보기
  public getMyTasks = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id as number;
    const tasks = await this.userService.getMyTasks(userId);
    return res.status(StatusCodes.OK).json(tasks);
  };
}
