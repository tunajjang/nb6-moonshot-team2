import { is, create } from 'superstruct';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EmailStruct, GetMyTasksQueryStruct } from '@superstructs';
import { UserService } from '@services';
import { GetMyTasksQuery } from '@types';

export class UserController {
  constructor(private userService: UserService) {}

  // 비밀번호 검증
  verifyPassword = async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const { password } = req.body;

    await this.userService.verifyPassword(userId, password);
    return res.status(StatusCodes.OK).json({ message: 'Password verified successfully!' });
  };

  // ID로 찾기
  getUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: '잘못된 요청입니다' });
      return;
    }
    const { password, ...userData } = await this.userService.getUserById(userId);
    return res.status(StatusCodes.OK).json(userData);
  };

  // 내정보 찾기
  getMe = async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const { password, ...userData } = await this.userService.getUserById(userId);
    return res.status(StatusCodes.OK).json(userData);
  };

  // 내정보 수정
  updateUser = async (req: Request, res: Response) => {
    const userId = req.user?.id as number;

    const { password, deletedAt, ...userData } = await this.userService.updateUser(
      userId,
      req.body,
    );
    return res.status(StatusCodes.OK).json(userData);
  };

  // 비밀번호 수정
  updatePassword = async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const { password } = req.body;
    await this.userService.updatePassword(userId, { password });
    return res.status(StatusCodes.OK).json({ message: '비밀번호가 변경되었습니다.' });
  };

  // 사용자 찾기
  findUsers = async (req: Request, res: Response) => {
    const users = await this.userService.findUsers();
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userData } = user;
      return userData;
    });
    return res.status(StatusCodes.OK).json(usersWithoutPassword);
  };

  // 사용자 삭제
  deleteUser = async (req: Request, res: Response) => {
    await this.userService.deleteUser(req.user?.id as number);
    return res.status(StatusCodes.OK).json({ message: '사용자를 삭제했습니다.' });
  };

  // EMAIL로 찾기
  findUserByEmail = async (req: Request, res: Response) => {
    const email = req.query.email as string;
    if (!is(email, EmailStruct)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email is required' });
      return;
    }
    const { password, ...userData } = await this.userService.findUserByEmail(email);
    return res.status(StatusCodes.OK).json(userData);
  };

  // 내 프로젝트 목록 보기
  getMyProjects = async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const projects = await this.userService.getMyProjects(userId);
    return res.status(StatusCodes.OK).json(projects);
  };

  // 내 할일 목록 보기
  getMyTasks = async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const query = create(req.query, GetMyTasksQueryStruct) as GetMyTasksQuery;
    const tasks = await this.userService.getMyTasks(userId, query);
    return res.status(StatusCodes.OK).json(tasks);
  };
}
