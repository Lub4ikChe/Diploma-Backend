import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserInformationController } from 'src/user/user-information/user-information.controller';

import { UserService } from 'src/user/services/user.service';
import { UserInviteService } from 'src/user/services/user-invite.service';
import { UserInformationService } from 'src/user/user-information/user-information.service';

import { UserRepository } from 'src/user/repositories/user.repository';
import { UserInviteRepository } from 'src/user/repositories/user-invite.repository';
import { UserInformation } from 'src/entities/user-information/user-information.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserInviteRepository,
      UserInformation,
    ]),
  ],
  providers: [UserService, UserInviteService, UserInformationService],
  controllers: [UserInformationController],
  exports: [UserService, UserInviteService],
})
export class UserModule {}
