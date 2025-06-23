import {injectable} from '@loopback/core';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export type EmailInfo = {
  from?: string;
  to: string;
  subject: string;
  html: string;
  attachments?: Mail.Attachment[];
};
@injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVICE,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // logger: true,
      // debug: true,
    });
  }

  async sendCustomEmail(toEmail: string, subject: string, emailBody: any) {
    const mailOptions = {
      from: '"REALSEO" <' + process.env.EMAIL_USER + '>',
      to: toEmail,
      subject: subject,
      html: emailBody,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Unable to send email');
    }
  }
}
