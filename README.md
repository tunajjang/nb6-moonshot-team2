# MOONSHOT (Team 2) - Project Management API Server

## 개요

### 2TEAM

- 팀원 구성: 정동원, 이주은, 김선영, 이상운
- 팀 협업 문서(Notion): https://www.notion.so/2-Node-js-2d1a5c7f474081b19188f8d9d9162ec8

### 프로젝트 소개

- 프로젝트명: MOON SHOT
- 설명: 프로젝트 생성 및 관리 도구를 제공하고, 팀원간 소통과 협업을 돕는 서비스입니다.
- 프로젝트 기간: 2025.12.22 ~ 2025.01.14
- 상세
  - 프로젝트 관리(Project Management)및 협업을 위한 API 서버
  - Node.js, Express, TypeScript 기반으로 구축
  - 안정적인 3-Layer Architecture(Controller-Service-Repository) 패턴 채택
  - Prisma ORM을 통해 PostgreSQL 데이터베이스 상호작용
  - `superstruct`를 이용한 데이터 검증 및 `Swagger`를 통한 API 문서환경 제공

---

## 팀원별 구현 기능 상세

### 이상운

인증, 유저

- 인증 API
  - 로그인 및 회원가입 기능 API 구현
  - 토큰 기반 인증 사용
- 구글 OAuth
  - 구글 소셜 로그인 구현
  - 구글 소셜 로그인을 통한 회원가입 가능
- 개인정보 수정
  - 비밀번호를 입력하여 인증 후 수정
  - 비밀번호, 프로필 이미지 수정 가능

### 김선영

프로젝트 CRUD

- 프로젝트 CRUD 기능
  - 프로젝트 CRUD 기능을 제공하는 API 구현
- 프로젝트 CRUD 인증 기능
  - 로그인 한 유저만 프로젝트 생성 가능
  - 참여한 프로젝트만 조회 가능
  - 프로젝트를 생성한 사람만 수정 및 삭제 가능
- 이메일 전송 기능
  - 참여 중인 프로젝트가 삭제되었을 경우, 멤버들에게 이메일로 알림 전송

### 정동원

할 일 CRUD, 파일 업로드

- 할 일 CRUD 기능
  - 할 일 CRUD 기능을 제공하는 API 구현
  - 할 일에 파일 업로드 가능
  - 페이지네이션 가능
  - 구글 캘린더에 반영하는 기능 구현
- 하위 할 일 CRUD 기능
  - 할 일 아래에 하위 할 일 CRUD 기능을 제공하는 API 구현
- 할 일 CRUD 인증 기능
  - 프로젝트에 참여하는 유저만 조회, 수정, 삭제 가능

### 이주은

댓글, 멤버

- 댓글 CRUD 기능
  - 댓글 CRUD 기능을 제공하는 API 구현
- 멤버 관리 및 이메일 전송 기능
  - 프로젝트 관리자가 가입한 유저에게 이메일로 프로젝트 초대 링크 전송 가능
  - 초대 링크에 접속 후 수락하여 프로젝트 참여 가능
  - 멤버 목록 조회에서 초대 상태 확인 가능
- 멤버 인증 기능
  - 프로젝트를 생성한 사람만 유저 초대 및 초대 취소, 멤버 제외 가능

---

### 기술 스택

- Backend: Node.js, Express.js
- Language: TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Validation: Superstruct
- Documentation: Swagger UI
- Authentication: JWT (jsonwebtoken), bcrypt
- File Upload: Multer

### 아키텍처

본 프로젝트는 관심사의 분리(SoC)를 위해 3-Layer Architecture를 따릅니다.

1. Controllers (`src/controllers/`)

   - HTTP 요청을 받아 파라미터를 파싱하고, `superstruct`를 통해 데이터 유효성 검증
   - 검증된 데이터를 Service 계층으로 전달하고, 처리 결과를 클라이언트에 응답

2. Services (`src/services/`)

   - 비즈니스 로직
   - Controller로부터 전달받은 데이터를 가공하고, Repository를 호출하여 데이터베이스 작업 수행
   - 권한 확인, 예외 처리 등 애플리케이션의 주요 규칙 실행

3. Repositories (`src/repositories/`)
   - 데이터베이스 접근
   - Prisma Client를 사용하여 실제 데이터를 조회(Read), 생성(Create), 수정(Update), 삭제(Delete) 실행

---

## 주요 기능

- 회원 관리: 회원가입, 로그인, 프로필 관리, 소셜 계정 연동(Google 등)
- 프로젝트 관리: 프로젝트 생성, 수정, 삭제, 프로젝트 멤버 초대 및 권한 관리
- 업무(Task) 관리:
  - 프로젝트 내 업무 생성 및 할당
  - 시작/종료일 설정, 상태 관리(Pending, In Progress, Done)
  - 태그(Tag) 및 첨부파일(Attachment) 관리
- 하위 업무(SubTask): 업무를 더 작은 단위로 쪼개어 관리
- 댓글(Comment): 업무에 대한 피드백 및 소통 기능
- 초대(Invitation): 이메일 기반 프로젝트 초대 및 수락/거절 프로세스

---

## API Endpoints

서버 실행 후 `/api-docs` 경로에서 Swagger UI를 통해 전체 API 명세를 확인할 수 있습니다.

### Auth (`/auth`)

- `POST /register`: 회원가입
- `POST /login`: 로그인
- `POST /logout`: 로그아웃 (인증 필요)
- `POST /refresh`: 리프래시 토큰 재발급
- `GET /google`: 구글 로그인 페이지로 리다이렉트
- `GET /google/callback`: 구글 로그인 콜백

### Users (`/users`)

- `GET /`: 사용자 목록 조회
- `GET /search`: 이메일로 회원 찾기
- `GET /me`: 내 정보 조회 (인증 필요)
- `PATCH /me`: 내 정보 수정 (인증 필요)
- `DELETE /me`: 회원 탈퇴 (인증 필요)
- `POST /me/verify-password`: 비밀번호 확인 (인증 필요)
- `PATCH /me/password`: 비밀번호 변경 (인증 필요)
- `GET /me/projects`: 내가 속한 프로젝트 목록 조회 (인증 필요)
- `GET /me/tasks`: 내게 할당된 작업 목록 조회 (인증 필요)

### Projects (`/projects`)

- `POST /`: 프로젝트 등록 (인증 필요)
- `GET /:projectId`: 프로젝트 상세 조회 (인증 필요)
- `PATCH /:projectId`: 프로젝트 수정 (인증 필요)
- `DELETE /:projectId`: 프로젝트 삭제 (인증 필요)
- `GET /:projectId/users`: 프로젝트 멤버 조회
- `DELETE /:projectId/users/:userId`: 프로젝트에서 유저 제외하기
- `POST /:projectId/invitations`: 프로젝트에 멤버 초대
- `GET /:projectId/invitations`: 프로젝트의 초대 목록 조회
- `POST /:projectId/tasks`: 프로젝트의 Task 생성 (인증 필요)
- `GET /:projectId/tasks`: 프로젝트의 Task 목록 조회 (인증 필요)

### Tasks (`/tasks`)

- `GET /:taskId`: 태스크 상세 조회 (인증 필요)
- `PATCH /:taskId`: 태스크 수정 (인증 필요)
- `DELETE /:taskId`: 태스크 삭제 (인증 필요)
- `POST /:taskId/subtasks`: 서브태스크 생성 (인증 필요)
- `GET /:taskId/subtasks`: 서브태스크 목록 조회 (인증 필요)

### SubTasks (`/subtasks`)

- `GET /:subTaskId`: 서브태스크 상세 조회 (인증 필요)
- `PATCH /:subTaskId`: 서브태스크 수정 (인증 필요)
- `DELETE /:subTaskId`: 서브태스크 삭제 (인증 필요)

### Members (`/members`)

- `GET /projects/:projectId/members`: 프로젝트 멤버 목록 조회 (인증 필요)
- `PUT /projects/:projectId/members/:memberId/role`: 멤버 역할 변경 (인증 필요)
- `PATCH /projects/:projectId/members/:memberId/status`: 멤버 상태 변경 (인증 필요)
- `DELETE /projects/:projectId/members/:memberId`: 멤버 삭제 (탈퇴) (인증 필요)
- `DELETE /projects/:projectId/members/:memberId/remove`: 멤버 강제 제외 (인증 필요)

### Comments (`/`)

- `GET /tasks/:taskId/comments`: 특정 태스크의 댓글 목록 조회
- `POST /tasks/:taskId/comments`: 댓글 생성 (인증 필요)
- `PUT /comments/:commentId`: 댓글 수정 (인증 필요)
- `DELETE /comments/:commentId`: 댓글 삭제 (인증 필요)

### Invitations (`/invitations`)

- `GET /:invitationId/accept`: 초대 링크 접속 (로그인 시 자동 수락)
- `POST /:invitationId/accept`: 초대 수락 (인증 필요)
- `DELETE /:invitationId`: 초대 삭제 (인증 필요)
- `POST /:invitationId/cancel`: 초대 취소 (인증 필요)

### Files (`/file`)

- `POST /`: 이미지 업로드 (다중 파일 가능)

---

## 프로젝트 폴더 구조

```
.
├── prisma/
│   ├── schema.prisma    <-- 데이터베이스 스키마 정의
│   └── seed.ts          <-- 초기 데이터 시딩 스크립트
├── src/
│   ├── main.ts          <-- 애플리케이션 진입점
│   ├── controllers/     <-- 요청 처리 및 응답
│   ├── services/        <-- 비즈니스 로직
│   ├── repositories/    <-- DB 데이터 접근
│   ├── routers/         <-- API 라우팅 정의
│   ├── middlewares/     <-- 인증, 에러 핸들링, 파일 업로드 등 미들웨어
│   ├── superstructs/    <-- 데이터 검증 스키마 (DTO 역할)
│   ├── types/           <-- TypeScript 타입 정의
│   ├── lib/             <-- 공통 유틸리티 및 에러 정의
│   └── swagger.ts       <-- Swagger 설정
├── package.json
├── tsconfig.json
└── README.md
```

---

## 설치 및 실행

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 데이터베이스 마이그레이션 (스키마 적용)
npx prisma migrate dev

# 3. (선택) 초기 데이터 시딩
npx prisma db seed

# 4. 개발 서버 실행
npm run dev
```

서버가 정상적으로 실행되면 `http://localhost:3000` 에서 API 사용가능

---

## 구현 홈페이지

(개발한 홈페이지에 대한 링크 게시)
https://www.codeit.kr/

---

## 프로젝트 회고록

(제작한 발표자료 링크 혹은 첨부파일 첨부)
