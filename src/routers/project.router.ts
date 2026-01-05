import { Router } from 'express';
import { ProjectController, MemberController, InvitationController } from '@controllers';
import { CreateInvitationSchema } from '@superstructs';
import { authenticate, asyncHandler } from '@middlewares'; // asyncHandler 잊지 말고 임포트!
import swaggerJSDoc from 'swagger-jsdoc';

export const projectRouter = (
  projectController: ProjectController,
  memberController: MemberController,
  invitationController: InvitationController,
) => {
  const router = Router();

  router.use(authenticate);

  /**
   * @swagger
   *  /projects:
   *    post:
   *      summary: 프로젝트 등록
   *      tags: [Project]
   *      security:
   *        - bearerAuth: []
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              required:
   *                - name
   *                - description
   *              properties:
   *                name:
   *                  type: string
   *                  example: "프로젝트 이름"
   *                description:
   *                  type: string
   *                  example: "프로젝트 상세 설명 및 내용"
   *      responses:
   *        201:
   *          description: "프로젝트 생성 성공"
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  id:
   *                    type: integer
   *                    example: 1
   *                  name:
   *                    type: string
   *                    example: "프로젝트 이름"
   *                  description:
   *                    type: string
   *                    example: "프로젝트 상세 설명 및 내용"
   *                  memberCount:
   *                    type: integer
   *                    example: 1
   *                  todoCount:
   *                    type: integer
   *                    example: 0
   *                  inProgressCount:
   *                    type: integer
   *                    example: 0
   *                  doneCount:
   *                    type: integer
   *                    example: 0
   *        400:
   *          description: "잘못된 데이터 형식"
   *        401:
   *          description: "로그인이 필요합니다"
   */
  router.post('/', asyncHandler(projectController.createProject));

  // 프로젝트 멤버 조회 (더 구체적인 경로를 먼저 정의)
  router.get('/:projectId/users', asyncHandler(memberController.getMembersByProjectId));

  // 프로젝트에서 유저 제외하기
  router.delete('/:projectId/users/:userId', asyncHandler(memberController.removeUserFromProject));

  // 프로젝트에 멤버 초대
  router.post(
    '/:projectId/invitations',
    ...CreateInvitationSchema,
    asyncHandler(invitationController.createInvitation),
  );

  // 프로젝트의 초대 목록 조회
  router.get(
    '/:projectId/invitations',
    asyncHandler(invitationController.getInvitationsByProjectId),
  );

  // 프로젝트 상세 조회, 수정, 삭제
  /**
   * @swagger
   *  /projects/{projectId}:
   *    get:
   *      summary: 프로젝트 상세 조회
   *      tags: [Project]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: projectId
   *          required: true
   *          schema:
   *            type: integer
   *          description: 조회할 프로젝트 ID
   *      responses:
   *        200:
   *          description: "조회 성공 (상세 정보를 반환합니다.)"
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  id:
   *                    type: integer
   *                  name:
   *                    type: string
   *                  description:
   *                    type: string
   *                  memberCount:
   *                    type: integer
   *                  todoCount:
   *                    type: integer
   *                  inProgressCount:
   *                    type: integer
   *                  doneCount:
   *                    type: integer
   *        401:
   *          description: "로그인이 필요합니다"
   *        403:
   *          description: "프로젝트 멤버가 아닙니다"
   *        404:
   *          description: "Not Found (응답 바디 없음)"
   */
  router.get('/:projectId', asyncHandler(projectController.getProjectDetail));

  /**
   * @swagger
   *  /projects/{projectId}:
   *    patch:
   *      summary: 프로젝트 수정
   *      tags: [Project]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: projectId
   *          required: true
   *          schema:
   *            type: integer
   *          description: 수정할 프로젝트 ID
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                name:
   *                  type: string
   *                  example: "수정된 프로젝트 명"
   *                description:
   *                  type: string
   *                  example: "설명도 수정해봅니다."
   *      responses:
   *        200:
   *          description: "수정 성공 (수정된 정보를 반환합니다.)"
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  id:
   *                    type: integer
   *                    example: 15
   *                  name:
   *                    type: string
   *                    example: "수정된 프로젝트 명"
   *                  description:
   *                    type: string
   *                    example: "설명도 수정해봅니다."
   *                  memberCount:
   *                    type: integer
   *                  todoCount:
   *                    type: integer
   *                  inProgressCount:
   *                    type: integer
   *                  doneCount:
   *                    type: integer
   *        400:
   *          description: "잘못된 데이터 형식"
   *        403:
   *          description: "프로젝트 관리자가 아닙니다"
   */
  router.patch('/:projectId', asyncHandler(projectController.updateProject));

  /**
   * @swagger
   *  /projects/{projectId}:
   *    delete:
   *      summary: 프로젝트 삭제
   *      tags: [Project]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: projectId
   *          required: true
   *          schema:
   *            type: integer
   *          description: 삭제할 프로젝트 ID
   *      responses:
   *        204:
   *          description: "프로젝트 삭제 성공 (응답 바디 없음, 멤버에게 삭제 안내 메일 발송)"
   *        400:
   *          description: "잘못된 데이터 형식"
   *        401:
   *          description: "로그인이 필요합니다"
   *        403:
   *          description: "프로젝트 관리자가 아닙니다"
   *        404:
   *          description: "존재하지 않는 프로젝트입니다 (응답 바디 없음)"
   */
  router.delete('/:projectId', asyncHandler(projectController.deleteProject));

  return router;
};
