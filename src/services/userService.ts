import { Prisma, User } from '@prisma/client';
import { UserRepository } from '../repositories/userRepository';
import { NotFoundError } from '../lib/errors/notFoundError';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  /**
   * 사용자 정보 조회
   */
  async getUserById(userId: User['id']) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found!');
    }
    return user;
  }

  /**
   * 사용자 정보 수정
   */
  async updateUser(userId: User['id'], userData: Prisma.UserUpdateInput) {
    await this.getUserById(userId);
    return this.userRepository.updateUser(userId, userData);
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
    return user;
  }
}
