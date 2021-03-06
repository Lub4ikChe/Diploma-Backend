import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttachmentModule } from 'src/attachment/attachment.module';
import { EmailModule } from 'src/email/email.module';

import { UserInformationController } from 'src/user/user-information/user-information.controller';
import { UserPhotoController } from 'src/user/user-photo/user-photo.controller';
import { UserController } from 'src/user/user.controller';
import { UserPasswordController } from 'src/user/user-password/user-password.controller';

import { UserService } from 'src/user/services/user.service';
import { UserInviteService } from 'src/user/services/user-invite.service';
import { UserInformationService } from 'src/user/user-information/user-information.service';
import { UserPhotoService } from 'src/user/user-photo/user-photo.service';
import { UserPasswordService } from 'src/user/user-password/user-password.service';

import { UserRepository } from 'src/user/repositories/user.repository';
import { UserInviteRepository } from 'src/user/repositories/user-invite.repository';
import { UserInformation } from 'src/entities/user-information/user-information.entity';
import { ResetPassword } from 'src/entities/user/reset-password.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserInviteRepository,
      UserInformation,
      ResetPassword,
    ]),
    AttachmentModule,
    EmailModule,
  ],
  providers: [
    UserService,
    UserInviteService,
    UserInformationService,
    UserPhotoService,
    UserPasswordService,
  ],
  controllers: [
    UserInformationController,
    UserPhotoController,
    UserController,
    UserPasswordController,
  ],
  exports: [UserService, UserInviteService],
})
export class UserModule {}
