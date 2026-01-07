import { MemberRepository } from '@repositories';
import { ProjectRole, MemberStatus } from '@prisma/client';
import {
  ProjectNotFoundError,
  MemberNotFoundError,
  MemberUnauthorizedError,
  OwnerCannotLeaveError,
} from '@lib';

export class MemberService {
  private memberRepository: MemberRepository;

  constructor() {
    this.memberRepository = new MemberRepository();
  }

  // 프로젝트 멤버 목록 조회
  async getMembersByProjectId(projectId: number, userId: number) {
    // 프로젝트 존재 여부 확인
    const projectExists = await this.memberRepository.projectExists(projectId);
    if (!projectExists) {
      throw new ProjectNotFoundError(projectId);
    }
    // 프로젝트 소유자이거나 멤버인지 확인
    const isOwner = await this.memberRepository.isProjectOwner(projectId, userId);
    const isMember = await this.memberRepository.isProjectMember(projectId, userId);
    if (!isOwner && !isMember) {
      throw new MemberUnauthorizedError('You must be a project member to view members');
    }
    return await this.memberRepository.findByProjectId(projectId);
  }

  // 멤버 역할 변경
  async updateMemberRole(memberId: number, role: ProjectRole, userId: number) {
    // 멤버 존재 여부 확인
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    // 프로젝트 소유자만 역할 변경 가능
    const isOwner = await this.memberRepository.isProjectOwner(member.projectId, userId);
    if (!isOwner) {
      throw new MemberUnauthorizedError('Only project owner can change member roles');
    }
    // 자신의 역할을 변경하려는 경우
    if (member.userId === userId && role === 'MEMBER') {
      const ownerCount = await this.memberRepository.countOwners(member.projectId);
      if (ownerCount <= 1) {
        throw new MemberUnauthorizedError('Project must have at least one owner');
      }
    }
    return await this.memberRepository.updateRole(memberId, role);
  }

  // 멤버 상태 변경 (PENDING -> ACCEPTED)
  async updateMemberStatus(memberId: number, memberStatus: MemberStatus, userId: number) {
    // 멤버 존재 여부 확인
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    // 자신의 상태만 변경 가능하거나, 프로젝트 소유자가 변경 가능
    const isOwner = await this.memberRepository.isProjectOwner(member.projectId, userId);
    const isSelf = member.userId === userId;
    if (!isOwner && !isSelf) {
      throw new MemberUnauthorizedError('You can only update your own member status');
    }
    return await this.memberRepository.updateStatus(memberId, memberStatus);
  }

  // 멤버 삭제 (탈퇴)
  async deleteMember(memberId: number, userId: number) {
    // 멤버 존재 여부 확인
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    // 자신만 탈퇴 가능
    if (member.userId !== userId) {
      throw new MemberUnauthorizedError('You can only leave the project yourself');
    }
    // 프로젝트 소유자는 탈퇴 불가
    if (member.role === 'OWNER') {
      const ownerCount = await this.memberRepository.countOwners(member.projectId);
      if (ownerCount <= 1) {
        throw new OwnerCannotLeaveError('Project owner cannot leave the project');
      }
    }
    return await this.memberRepository.softDelete(memberId);
  }

  // 멤버 강제 제외 (프로젝트 생성자만 가능)
  async removeMember(memberId: number, userId: number) {
    // 멤버 존재 여부 확인
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    // 프로젝트 소유자만 멤버 제외 가능
    const isOwner = await this.memberRepository.isProjectOwner(member.projectId, userId);
    if (!isOwner) {
      throw new MemberUnauthorizedError('Only project owner can remove members');
    }
    // 자신을 제외할 수 없음 (탈퇴는 deleteMember 사용)
    if (member.userId === userId) {
      throw new MemberUnauthorizedError('You cannot remove yourself. Use leave project instead.');
    }
    // 프로젝트 소유자를 제외할 수 없음
    if (member.role === 'OWNER') {
      const ownerCount = await this.memberRepository.countOwners(member.projectId);
      if (ownerCount <= 1) {
        throw new MemberUnauthorizedError('Cannot remove the only owner of the project');
      }
    }
    return await this.memberRepository.softDelete(memberId);
  }

  // 프로젝트에서 유저 제외하기 (userId로)
  async removeUserFromProject(projectId: number, userId: number, requesterId: number) {
    // 프로젝트 존재 여부 확인
    const projectExists = await this.memberRepository.projectExists(projectId);
    if (!projectExists) {
      throw new ProjectNotFoundError(projectId);
    }
    // 프로젝트 소유자만 멤버 제외 가능
    const isOwner = await this.memberRepository.isProjectOwner(projectId, requesterId);
    if (!isOwner) {
      throw new MemberUnauthorizedError('Only project owner can remove members');
    }
    // 제외할 멤버 조회
    const member = await this.memberRepository.findByProjectAndUser(projectId, userId);
    if (!member) {
      throw new MemberNotFoundError(0); // userId로 찾은 멤버가 없음
    }
    // 자신을 제외할 수 없음
    if (member.userId === requesterId) {
      throw new MemberUnauthorizedError('You cannot remove yourself. Use leave project instead.');
    }
    // 프로젝트 소유자를 제외할 수 없음
    if (member.role === 'OWNER') {
      const ownerCount = await this.memberRepository.countOwners(projectId);
      if (ownerCount <= 1) {
        throw new MemberUnauthorizedError('Cannot remove the only owner of the project');
      }
    }
    return await this.memberRepository.softDelete(member.id);
  }

  /**
   * 할 일 담당자 지정 시 프로젝트 멤버인지 검증
   * @param projectId 프로젝트 ID
   * @param assigneeId 담당자로 지정할 사용자 ID
   * @throws BadRequestError 담당자가 프로젝트 멤버가 아닌 경우
   */
  async validateAssignee(projectId: number, assigneeId: number): Promise<void> {
    // 프로젝트 존재 여부 확인
    const projectExists = await this.memberRepository.projectExists(projectId);
    if (!projectExists) {
      throw new ProjectNotFoundError(projectId);
    }

    // 담당자가 프로젝트 멤버인지 확인 (ACCEPTED 상태이고 삭제되지 않은 멤버만)
    const isMember = await this.memberRepository.isProjectMember(projectId, assigneeId);
    if (!isMember) {
      throw new MemberUnauthorizedError('담당자는 해당 프로젝트에 참여하는 멤버여야 합니다.');
    }
  }
}
