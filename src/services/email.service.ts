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

  constructor() {
    // 환경 변수에서 이메일 설정 가져오기
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER || '';
    const smtpPassword = process.env.SMTP_PASSWORD || '';
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
  }

  //초대 이메일 발송
  async sendInvitationEmail({
    to,
    invitationId,
    projectName,
    hostName,
    invitationLink,
  }: SendInvitationEmailParams): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: `[MOONSHOT] ${projectName} 프로젝트 초대`,
      html: `
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
      `,
      text: `
프로젝트 초대 안내

안녕하세요,
${hostName}님께서 ${projectName} 프로젝트에 초대하셨습니다.

프로젝트명: ${projectName}
초대자: ${hostName}

초대를 수락하시려면 아래 링크를 클릭하세요:
${invitationLink}
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`초대 이메일 발송 완료: ${to}`);
    } catch (error) {
      console.error('이메일 발송 실패:', error);
      // 이메일 발송 실패해도 초대는 생성되었으므로 에러를 던짐
      // 호출하는 곳에서 catch하여 처리할 수 있도록 함
      throw new Error('이메일 발송에 실패했습니다.');
    }
  }

  //프로젝트 삭제 알림 이메일 발송
  async sendProjectDeletedEmail({
    to,
    projectName,
    ownerName,
  }: {
    to: string;
    projectName: string;
    ownerName: string;
  }): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: `[MOONSHOT] ${projectName} 프로젝트가 삭제되었습니다`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">프로젝트 삭제 안내</h2>
          <p>안녕하세요,</p>
          <p><strong>${ownerName}</strong>님께서 <strong>${projectName}</strong> 프로젝트를 삭제하셨습니다.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>프로젝트명:</strong> ${projectName}</p>
            <p style="margin: 10px 0 0 0;"><strong>삭제자:</strong> ${ownerName}</p>
          </div>
          <p style="color: #666; margin-top: 20px;">
            해당 프로젝트에 대한 모든 데이터가 삭제되었으며, 더 이상 접근하실 수 없습니다.
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            문의사항이 있으시면 프로젝트 소유자에게 직접 연락해주세요.
          </p>
        </div>
      `,
      text: `
프로젝트 삭제 안내

안녕하세요,
${ownerName}님께서 ${projectName} 프로젝트를 삭제하셨습니다.

프로젝트명: ${projectName}
삭제자: ${ownerName}

해당 프로젝트에 대한 모든 데이터가 삭제되었으며, 더 이상 접근하실 수 없습니다.

문의사항이 있으시면 프로젝트 소유자에게 직접 연락해주세요.
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`프로젝트 삭제 알림 이메일 발송 완료: ${to}`);
    } catch (error) {
      console.error('이메일 발송 실패:', error);
      throw new Error('이메일 발송에 실패했습니다.');
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
