import nodemailer from 'nodemailer';

export class MailService {
  // 1. 메일 발송을 위한 transporter 설정
  private transporter = nodemailer.createTransport({
    service: 'gmail', // 우리 서버가 어느 메일 서버를 이용할 것인지? => 일단 Gmail 사용 (네이버 등으로 변경 가능)
    auth: {
      user: process.env.SMTP_USER, // 내 이메일 주소 (보내는 사람)
      pass: process.env.SMTP_PASS, // 이메일 앱 비밀번호
    },
  });

  /**
   * 프로젝트 삭제 알림 이메일 발송
   * @param emails 수신자 이메일 배열
   * @param projectName 삭제된 프로젝트 이름
   */
  async sendProjectDeletionEmail(emails: string[], projectName: string): Promise<void> {
    try {
      // 2. 메일 옵션 설정
      const mailOptions = {
        from: `"Project Manager" <${process.env.SMTP_USER}>`,
        to: emails.join(','), // 여러 명에게 한 번에 보낼 때 쉼표로 연결
        subject: `[알림] 프로젝트 '${projectName}'가 삭제되었습니다.`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2>프로젝트 삭제 알림</h2>
            <p>안녕하세요.</p>
            <p>참여 중이신 프로젝트 <b>'${projectName}'</b>가 삭제되었음을 알려드립니다.</p>
            <p>더 이상 해당 프로젝트의 데이터에 접근하실 수 없습니다.</p>
            <hr />
            <p style="font-size: 0.8em; color: #666;">본 메일은 시스템에 의해 자동으로 발송되었습니다.</p>
          </div>
        `,
      };

      // 3. 메일 발송 실행
      const info = await this.transporter.sendMail(mailOptions);
      console.log('이메일 발송 성공:', info.messageId);
    } catch (error) {
      // 메일 발송 실패가 전체 로직을 멈추지 않도록 에러 로깅만 수행
      console.error('이메일 발송 실패:', error);
    }
  }
}

// 싱글톤 패턴으로 내보내기 (선택 사항)
export const mailService = new MailService();
