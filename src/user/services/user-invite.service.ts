import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';

import { confirmRegistrationEmail } from 'src/email/templates/confirm-registration';
import { UserStatus } from 'src/user/enums/user-status.enum';

import { UserInvite } from 'src/entities/user/user-invite.entity';

import { UserInviteRepository } from 'src/user/repositories/user-invite.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

interface EmailData {
  link: string;
}

interface SendConfirmEmailProps {
  to: string;
  inviteToken: string;
}

@Injectable()
export class UserInviteService {
  constructor(
    @InjectRepository(UserInviteRepository)
    private userInviteRepository: UserInviteRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly mailerService: MailerService,
  ) {}

  async createInviteForUser(): Promise<UserInvite> {
    return this.userInviteRepository.createUserInvite();
  }

  async sendConfirmEmail(data: SendConfirmEmailProps): Promise<void> {
    const { to, inviteToken } = data;
    // MAYBE: change it to client url
    const link = `${process.env.SERVER_URL}/activate/${inviteToken}`;
    return this.mailerService.sendMail({
      to,
      from: process.env.DEFAULT_SENDER,
      subject: 'Confirm registration',
      html: this.fillData(confirmRegistrationEmail, { link }),
    });
  }

  async activateUserAccount(inviteToken: string) {
    const invite = await this.userInviteRepository.activate(inviteToken);
    const user = await this.userRepository.findOne({ invite });
    user.status = UserStatus.ACTIVE;
    return this.userRepository.save(user);
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
