import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Put,
} from '@nestjs/common';

import { UserPasswordService } from 'src/user/user-password/user-password.service';

import { SkipAuth } from 'src/auth/decorators/skip-auth.decorator';
import { GetJWTPayload } from 'src/auth/decorators/get-jwt-payload.decorator';

import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import { ResetPassword } from 'src/entities/user/reset-password.entity';

import { ForgotPasswordDto } from 'src/user/user-password/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/user/user-password/dto/reset-password.dto';
import { ChangePasswordDto } from 'src/user/user-password/dto/change-password.dto';

@Controller('password')
export class UserPasswordController {
  constructor(private userPasswordService: UserPasswordService) {}

  @SkipAuth()
  @Post('/request')
  @HttpCode(HttpStatus.CREATED)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    return this.userPasswordService.forgotPassword(forgotPasswordDto);
  }

  @SkipAuth()
  @Post('/reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPassword> {
    return this.userPasswordService.resetPassword(resetPasswordDto);
  }

  @Put('')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetJWTPayload() jwtPayload: JwtPayload,
  ): Promise<void> {
    return this.userPasswordService.changePassword(
      changePasswordDto,
      jwtPayload.email,
    );
  }
}
