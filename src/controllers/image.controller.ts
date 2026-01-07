import { Request, Response } from 'express';
import { prisma } from '@lib';

export const uploadImages = async (req: Request, res: Response) => {
  const taskId = Number(req.body.taskId);
  const files = req.files as Express.Multer.File[];

  if (!taskId) {
    return res.status(400).json({ message: 'taskId가 필요합니다.' });
  }

  if (!files || files.length === 0) {
    return res.status(400).json({ message: '업로드된 파일이 없습니다.' });
  }

  // task 존재 확인
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return res.status(404).json({ message: '존재하지 않는 task입니다.' });
  }

  // Attachment 저장
  const attachments = await prisma.attachment.createMany({
    data: files.map((file) => ({
      taskId,
      title: file.originalname,
      fileName: file.filename,
      url: `/uploads/${file.filename}`,
    })),
  });

  res.status(201).json({
    message: '이미지 업로드 성공',
    count: attachments.count,
  });
};
