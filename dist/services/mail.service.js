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
        // 1. 환경 변수 로드 (SMTP_PASSWORD로 통일)
        const smtpUser = process.env.SMTP_USER || '';
        const smtpPassword = process.env.SMTP_PASSWORD || '';
        this.smtpFrom = process.env.SMTP_FROM || smtpUser;
        // 2. 환경 변수 검증
        if (!smtpUser || !smtpPassword) {
            console.warn('⚠️ [MailService] SMTP 설정(USER 또는 PASSWORD)이 누락되었습니다. .env 파일을 확인해주세요.');
        }
        // 3. nodemailer 설정
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail', // Gmail 서비스 이용
            auth: {
                user: smtpUser,
                pass: smtpPassword,
            },
        });
    }
    /**
     * [기능 1] 프로젝트 삭제 알림 (BCC 활용)
     */
    sendProjectDeletionEmail(emails, projectName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailOptions = {
                    from: `"Moonshot Project Manager" <${this.smtpFrom}>`,
                    to: `"Moonshot System Admin" <${this.smtpFrom}>`,
                    bcc: emails, // 멤버들끼리 이메일이 노출되지 않도록 숨은 참조 처리
                    subject: `[알림] 프로젝트 '${projectName}'가 삭제되었습니다.`,
                    html: `
          <div style="font-family: sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #d9534f;">프로젝트 삭제 알림</h2>
            <p>안녕하세요. Moonshot입니다.</p>
            <p>참여 중이신 프로젝트 <b>'${projectName}'</b>가 삭제되었음을 알려드립니다.</p>
            <p>더 이상 해당 프로젝트의 데이터에 접근하실 수 없습니다.</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 0.8em; color: #666;">본 메일은 시스템에 의해 자동으로 발송되었습니다.</p>
          </div>
        `,
                };
                yield this.transporter.sendMail(mailOptions);
                console.log(`[Mail] 삭제 알림 발송 성공: ${emails.length}명`);
            }
            catch (error) {
                console.error('[Mail] 삭제 알림 발송 실패:', error);
            }
        });
    }
    /**
     * [기능 2] 프로젝트 초대 이메일 발송
     */
    sendInvitationEmail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ to, projectName, hostName, invitationLink, }) {
            const mailOptions = {
                from: `"Moonshot Team" <${this.smtpFrom}>`,
                to,
                subject: `[MOONSHOT] ${projectName} 프로젝트 초대`,
                html: this.createInvitationEmailHtml(projectName, hostName, invitationLink),
                text: this.createInvitationEmailText(projectName, hostName, invitationLink),
            };
            try {
                yield this.transporter.sendMail(mailOptions);
                console.log(`[Mail] 초대 이메일 발송 완료: ${to}`);
            }
            catch (error) {
                console.error(`[Mail] 초대 이메일 발송 실패 (수신자: ${to}):`, error);
                throw new Error(`이메일 발송에 실패했습니다: ${error instanceof Error ? error.message : 'Unknown Error'}`);
            }
        });
    }
    // 초대 이메일 HTML 템플릿
    createInvitationEmailHtml(projectName, hostName, invitationLink) {
        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #333;">프로젝트 초대 안내</h2>
        <p>안녕하세요,</p>
        <p><strong>${hostName}</strong>님께서 <strong>${projectName}</strong> 프로젝트에 초대하셨습니다.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>프로젝트명:</strong> ${projectName}</p>
          <p style="margin: 10px 0 0 0;"><strong>초대자:</strong> ${hostName}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${invitationLink}" 
             style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            초대 수락하기
          </a>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          위 버튼이 작동하지 않는 경우, 아래 링크를 복사하여 브라우저에 붙여넣으세요:<br/>
          <a href="${invitationLink}">${invitationLink}</a>
        </p>
      </div>
    `;
    }
    // 초대 이메일 텍스트 버전
    createInvitationEmailText(projectName, hostName, invitationLink) {
        return `
프로젝트 초대 안내

안녕하세요,
${hostName}님께서 ${projectName} 프로젝트에 초대하셨습니다.

프로젝트명: ${projectName}
초대자: ${hostName}

초대를 수락하시려면 아래 링크를 클릭하세요:
${invitationLink}
    `;
    }
}
exports.MailService = MailService;
// 싱글톤 인스턴스 내보내기
exports.mailService = new MailService();
