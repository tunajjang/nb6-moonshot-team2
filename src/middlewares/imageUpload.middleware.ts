import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';
import fs from 'fs';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

//서버 시작시 이미지를 저장할 UPLOAD 폴더가 존재하지 않으면 폴더를 생성하도록 만듬
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 실제 파일 경로 + 확장자(ext)
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, crypto.randomUUID() + ext);
  },
});

// MIME 타입 검사 (실제 이미지 타입인지)
function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const allowExt = ['.jpeg', '.png', '.jpg'];
  const ext = path.extname(file.originalname).toLowerCase();
  const isImage = file.mimetype.startsWith('image/');

  if (!isImage || !allowExt.includes(ext)) {
    const error = new Error('jpg/png 형식의 이미지 파일만 업로드할 수 있습니다.');
    (error as any).status = 400;
    return cb(error);
  }

  cb(null, true);
}

// 파일 크기 제한 (5MB)
const limits = { fileSize: 5 * 1024 * 1024 };

// 단일 + 다중 포함
export const uploadMulti = multer({
  storage,
  fileFilter,
  limits,
}).any(); //array('images', 10);

export const uploadNone = multer().none();
