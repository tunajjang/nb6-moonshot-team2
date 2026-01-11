import { AppError } from './app.error';

export class GoogleCalendarError extends AppError {
  constructor(message: string = '구글캘린더와 연동 중 에러가 생겼습니다') {
    super(message, 502);
    this.name = 'GoogleCalendarError';
  }
}
