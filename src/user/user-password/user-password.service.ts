import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as moment from 'moment';
import * as bcrypt from 'bcryptjs';

import { ResetPassword } from 'src/entities/user/reset-password.entity';
import { User } from 'src/entities/user/user.entity';

import { UserStatus } from 'src/user/enums/user-status.enum';

import { UserRepository } from 'src/user/repositories/user.repository';

import { EmailService } from 'src/email/email.service';

import { ForgotPasswordDto } from 'src/user/user-password/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/user/user-password/dto/reset-password.dto';
import { ChangePasswordDto } from 'src/user/user-password/dto/change-password.dto';

@Injectable()
export class UserPasswordService {
  constructor(
    @InjectRepository(ResetPassword)
    private resetPasswordRepository: Repository<ResetPassword>,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private emailService: EmailService,
  ) {}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status === UserStatus.PENDING_ACTIVATION) {
      throw new BadRequestException('Activate your account');
    }

    const resetPassword = await this.createResetPassword(user);
    return this.emailService.sendResetPasswordEmail({
      to: email,
      resetToken: resetPassword.token,
    });
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPassword> {
    const { token, password } = resetPasswordDto;
    const resetPassword = await this.resetPasswordRepository.findOneOrFail({
      where: { token },
      relations: ['user'],
    });
    this.verifyResetToken(resetPassword);

    const { user } = resetPassword;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    await this.userRepository.save(user);

    resetPassword.used = true;
    return this.resetPasswordRepository.save(resetPassword);
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    email: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne(
      { email },
      { select: ['id', 'password', 'salt'] },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { currentPassword, password: newPassword } = changePasswordDto;

    const isPasswordValid = await this.userRepository.validateUserPassword(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid Credentials');
    }

    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, user.salt);
    await this.userRepository.save(user);
    return null;
  }

  private async createResetPassword(user: User) {
    const resetPassword = this.resetPasswordRepository.create();
    resetPassword.user = user;
    resetPassword.used = false;
    resetPassword.createdAt = new Date();
    return this.resetPasswordRepository.save(resetPassword);
  }

  private verifyResetToken(resetPassword: ResetPassword): void {
    const createdAt = moment(resetPassword.createdAt);
    const difference = moment().diff(createdAt, 'minutes');

    const isExpired = difference > 60;

    if (!resetPassword) {
      throw new BadRequestException(
        'Your token is not valid, please try again',
      );
    }
    if (resetPassword.used) {
      throw new BadRequestException(
        'Your token is already used, please reset your password again',
      );
    }
    if (isExpired) {
      throw new BadRequestException('Your token has expired, please try again');
    }
  }
}
