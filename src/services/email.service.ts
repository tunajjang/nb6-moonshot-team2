import nodemailer from 'nodemailer';

interface SendInvitationEmailParams {
  to: string;
  invitationId: string;
  projectName: string;
  hostName: string;
  invitationLink: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private smtpFrom: string;

  constructor() {
    // 환경 변수에서 이메일 설정 가져오기
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER || '';
    const smtpPassword = process.env.SMTP_PASSWORD || '';
    this.smtpFrom = process.env.SMTP_FROM || smtpUser;

    // 환경 변수 검증
    if (!smtpUser || !smtpPassword) {
      console.warn('⚠️ SMTP 설정이 누락되었습니다. 이메일 발송 기능이 작동하지 않을 수 있습니다.');
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // 465 포트는 true, 다른 포트는 false
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
  }

  // 초대 이메일 HTML 템플릿 생성
  private createInvitationEmailHtml(
    projectName: string,
    hostName: string,
    invitationLink: string,
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
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
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            초대 수락하기
          </a>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          위 버튼이 작동하지 않는 경우, 아래 링크를 복사하여 브라우저에 붙여넣으세요:<br/>
          ${invitationLink}
        </p>
      </div>
    `;
  }

  // 초대 이메일 텍스트 버전 생성
  private createInvitationEmailText(
    projectName: string,
    hostName: string,
    invitationLink: string,
  ): string {
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

  // 초대 이메일 발송
  async sendInvitationEmail({
    to,
    invitationId,
    projectName,
    hostName,
    invitationLink,
  }: SendInvitationEmailParams): Promise<void> {
    const mailOptions = {
      from: this.smtpFrom,
      to,
      subject: `[MOONSHOT] ${projectName} 프로젝트 초대`,
      html: this.createInvitationEmailHtml(projectName, hostName, invitationLink),
      text: this.createInvitationEmailText(projectName, hostName, invitationLink),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`초대 이메일 발송 완료: ${to}`);
    } catch (error) {
      console.error(`이메일 발송 실패 (수신자: ${to}):`, error);
      // 이메일 발송 실패해도 초대는 생성되었으므로 에러를 던짐
      // 호출하는 곳에서 catch하여 처리할 수 있도록 함
      throw new Error(
        `이메일 발송에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    }
  }

  //이메일 서비스 연결 테스트
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('이메일 서비스 연결 실패:', error);
      return false;
    }
  }
}
