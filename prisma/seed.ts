import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker/locale/ko';

const prisma = new PrismaClient();

async function main() {
  console.log('사용자 생성시작!');

  const saltRounds = 10;

  for (let i = 0; i < 30; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync('password1234', saltRounds),
        profileImage: faker.image.avatar(),
      },
    });
  }
  console.log('사용자 생성완료!');

  console.log('태그생성시작');
  for (let i = 0; i < 30; i++) {
    await prisma.tag.create({
      data: { name: faker.animal.petName() },
    });
  }
  console.log('태그생성완료');

  console.log('프로젝트 생성시작');
  const users = await prisma.user.findMany();
  for (let i = 0; i < 10; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    await prisma.project.create({
      data: {
        name: faker.book.title() + ' 프로젝트',
        description: faker.lorem.sentence(10),
        ownerId: randomUser.id,
      },
    });
  }
  console.log('프로젝트 생성완료');

  console.log('프로젝트 멤버 생성시작');
  const projects = await prisma.project.findMany();

  for (const project of projects) {
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: project.ownerId,
        role: 'OWNER',
        memberStatus: 'ACCEPTED',
      },
    });

    const otherMembers = users
      .filter((user) => user.id !== project.ownerId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    for (const member of otherMembers) {
      await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: member.id,
          role: 'MEMBER',
          memberStatus: 'ACCEPTED',
        },
      });
    }
  }
  console.log('프로젝트 멤버 생성 완료!');

  console.log('Task 및 관련 데이터 생성 시작');

  const tags = await prisma.tag.findMany();
  const projectWithMembers = await prisma.project.findMany({
    include: {
      projectMembers: {
        include: {
          user: true,
        },
      },
    },
  });

  for (const project of projectWithMembers) {
    const members = project.projectMembers.map((pm) => pm.user);
    if (members.length === 0) continue;
    const taskCount = faker.number.int({ min: 5, max: 10 });
    for (let i = 0; i < taskCount; i++) {
      const randomAssignee = faker.helpers.arrayElement(members);

      const task = await prisma.task.create({
        data: {
          projectId: project.id,
          title: faker.hacker.phrase(),
          assigneeId: randomAssignee.id,
          status: faker.helpers.arrayElement(['PENDING', 'IN_PROGRESS', 'DONE']),
          startAt: faker.date.recent({ days: 30 }),
          endAt: faker.date.future({ years: 1 }),
        },
      });

      const randomCommenter = faker.helpers.arrayElement(members);
      await prisma.comment.create({
        data: {
          taskId: task.id,
          authorId: randomCommenter.id,
          content: faker.lorem.paragraph(),
        },
      });

      const randomTag = faker.helpers.arrayElement(tags);
      await prisma.taskTag.create({
        data: {
          taskId: task.id,
          tagId: randomTag.id,
        },
      });
    }
  }
  console.log('Task 및 관련 데이터 생성완료');
  console.log('데이터 베이스 시딩 완료');
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
