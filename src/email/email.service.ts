import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { confirmRegistrationEmail } from 'src/email/templates/confirm-registration';
import { resetPasswordEmail } from 'src/email/templates/reset-password';

interface EmailData {
  link: string;
}

interface SendConfirmEmailProps {
  to: string;
  inviteToken: string;
}

interface SendResetPasswordEmailProps {
  to: string;
  resetToken: string;
}

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmEmail(data: SendConfirmEmailProps): Promise<void> {
    const { to, inviteToken } = data;
    // MAYBE: change it to client url
    const link = `${process.env.SERVER_URL}/auth/activate/${inviteToken}`;
    return this.mailerService.sendMail({
      to,
      from: process.env.DEFAULT_SENDER,
      subject: 'Confirm registration',
      html: this.fillData(confirmRegistrationEmail, { link }),
    });
  }

  async sendResetPasswordEmail(
    data: SendResetPasswordEmailProps,
  ): Promise<void> {
    const { to, resetToken } = data;
    const link = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    return this.mailerService.sendMail({
      to,
      from: process.env.DEFAULT_SENDER,
      subject: 'Reset password',
      html: this.fillData(resetPasswordEmail, { link }),
    });
  }

  private fillData(template: string, data: EmailData) {
    return Object.keys(data).reduce((email, key) => {
      const re = new RegExp(`{{ ${key} }}`, 'gi');
      const value = data[key];
      return email.replace(re, this.escapeHtml(value));
    }, template);
  }

  private escapeHtml = (message: string) => {
    return message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&#34;');
  };
}
