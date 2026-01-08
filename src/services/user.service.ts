import { Prisma, User, TaskStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import { UserRepository } from '@repositories';
import { NotFoundError, AppError } from '@lib';
import { StatusCodes } from 'http-status-codes';
import { UpdateUserRequest, GetMyTasksQuery } from '@types';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  /**
   * 비밀번호 검증
   */
  async verifyPassword(userId: User['id'], password: User['password']) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User Not Found!');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('비밀번호가 일치하지 않습니다.', StatusCodes.UNAUTHORIZED);
    }
    return true;
  }

  /**
   * 사용자 정보 조회
   */
  async getUserById(userId: User['id']) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found!');
    }
    const { deletedAt, ...userData } = user;
    return userData;
  }

  /**
   * 사용자 정보 수정
   */
  async updateUser(userId: User['id'], userData: UpdateUserRequest) {
    const user = await this.getUserById(userId);
    const isPassword = await bcrypt.compare(userData.currentPassword, user.password);
    if (!isPassword) {
      throw new AppError('현재 비밀번호가 일치하지 않습니다.', StatusCodes.UNAUTHORIZED);
    }

    const updateData: any = {};
    if (userData.email) updateData.email = userData.email;
    if (userData.name) updateData.name = userData.name;
    if (userData.profileImage !== undefined) updateData.profileImage = userData.profileImage;
    if (userData.newPassword && typeof userData.newPassword === 'string') {
      updateData.password = await bcrypt.hash(userData.newPassword, 10);
    }

    return this.userRepository.updateUser(userId, updateData);
  }

  /**
   * 비밀번호 수정
   */
  async updatePassword(userId: User['id'], userData: Prisma.UserUpdateInput) {
    await this.getUserById(userId);
    const hashedPassword = await bcrypt.hash(userData.password as string, 10);
    return await this.userRepository.updatePassword(userId, { password: hashedPassword });
  }

  /**
   * 사용자 정보 삭제(soft delete)
   */
  async deleteUser(userId: User['id']) {
    await this.getUserById(userId);
    return this.userRepository.deleteUser(userId);
  }

  /**
   * 사용자 목록 조회
   */
  async findUsers() {
    return this.userRepository.findUsers();
  }

  /**
   * 이메일로 사용자 조회
   */
  async findUserByEmail(email: User['email']) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const { deletedAt, ...userData } = user;
    return userData;
  }

  /**
   * 내 프로젝트 목록 조회
   */
  async getMyProjects(userId: User['id']) {
    const projects = await this.userRepository.findProjectsByUserId(userId);

    const projectList = projects.map((project) => {
      const todoCount = project.tasks.filter((task) => task.status === 'PENDING').length;
      const inProgressCount = project.tasks.filter((task) => task.status === 'IN_PROGRESS').length;
      const doneCount = project.tasks.filter((task) => task.status === 'DONE').length;

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        memberCount: project._count.projectMembers,
        todoCount,
        inProgressCount,
        doneCount,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
    });

    return {
      data: projectList,
      total: projectList.length,
    };
  }

  /**
   * 내 태스크 목록 조회
   */
  async getMyTasks(userId: User['id'], query: GetMyTasksQuery) {
    const { page, limit, from, to, project_id, status, assignee_id, keyword, order, order_by } =
      query;

    let mappedStatus: TaskStatus | undefined;
    if (status === 'todo') mappedStatus = 'PENDING';
    if (status === 'in_progress') mappedStatus = 'IN_PROGRESS';
    if (status === 'done') mappedStatus = 'DONE';

    let prismaOrderBy: any = { createdAt: order };
    if (order_by === 'name') prismaOrderBy = { title: order };
    if (order_by === 'end_date') {
      prismaOrderBy = [{ endYear: order }, { endMonth: order }, { endDay: order }];
    }

    const { total, data } = await this.userRepository.findTasksByUserId(userId, {
      page,
      limit,
      from,
      to,
      projectId: project_id,
      status: mappedStatus,
      assigneeId: assignee_id,
      keyword,
      orderBy: prismaOrderBy,
    });

    const taskList = data.map((task) => {
      return {
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        startYear: task.startYear,
        startMonth: task.startMonth,
        startDay: task.startDay,
        endYear: task.endYear,
        endMonth: task.endMonth,
        endDay: task.endDay,
        status: task.status,
        assignee: task.assignee,
        tags: task.taskTags.map((tt) => ({ id: tt.tag.id, name: tt.tag.name })),
        attachments: task.attachments.map((a) => a.url),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      };
    });

    return {
      data: taskList,
      total: taskList.length,
    };
  }
}
