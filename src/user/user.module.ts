import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from 'src/user/services/user.service';
import { UserInviteService } from 'src/user/services/user-invite.service';

import { UserRepository } from 'src/user/repositories/user.repository';
import { UserInviteRepository } from 'src/user/repositories/user-invite.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, UserInviteRepository])],
  providers: [UserService, UserInviteService],
  exports: [UserService, UserInviteService],
})
export class UserModule {}
