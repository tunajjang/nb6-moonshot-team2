"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailService = exports.MailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class MailService {
    constructor() {
        // 환경 변수 체크
        if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
            console.warn('⚠️ SMTP 설정이 누락되었습니다. 메일 발송 기능이 작동하지 않을 수 있습니다.');
        }
        // 1. 메일 발송을 위한 transporter 설정
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail', // 우리 서버가 어느 메일 서버를 이용할 것인지? => 일단 Gmail 사용 (네이버 등으로 변경 가능)
            auth: {
                user: process.env.SMTP_USER, // 내 이메일 주소 (보내는 사람)
                pass: process.env.SMTP_PASSWORD, // 이메일 앱 비밀번호
            },
        });
    }
    sendProjectDeletionEmail(emails, projectName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 2. 메일 옵션 설정
                const mailOptions = {
                    from: `"Moonshot Project Manager" <${process.env.SMTP_USER}>`,
                    to: `"Moonshot System Admin" <${process.env.SMTP_USER}>`,
                    bcc: emails, // 숨은 참조: 멤버들은 서로의 메일을 볼 수 없음
                    subject: `[알림] 프로젝트 '${projectName}'가 삭제되었습니다.`,
                    html: `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2>프로젝트 삭제 알림</h2>
            <p>안녕하세요. moonshot입니다.</p>
            <p>참여 중이신 프로젝트 <b>'${projectName}'</b>가 삭제되었음을 알려드립니다.</p>
            <p>더 이상 해당 프로젝트의 데이터에 접근하실 수 없습니다.</p>
            <hr />
            <p style="font-size: 0.8em; color: #666;">본 메일은 시스템에 의해 자동으로 발송되었습니다.</p>
          </div>
        `,
                };
                // 3. 메일 발송 실행
                const info = yield this.transporter.sendMail(mailOptions);
                console.log('이메일 발송 성공:', info.messageId);
            }
            catch (error) {
                // 메일 발송 실패가 전체 로직을 멈추지 않도록 에러 로깅만 수행
                console.error('이메일 발송 실패:', error);
            }
        });
    }
}
exports.MailService = MailService;
// 싱글톤 패턴으로 내보내기 (선택 사항)
exports.mailService = new MailService();
