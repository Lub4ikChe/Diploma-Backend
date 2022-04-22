import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserStatus } from 'src/user/enums/user-status.enum';

import { UserInvite } from 'src/entities/user/user-invite.entity';

import { UserInviteRepository } from 'src/user/repositories/user-invite.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

@Injectable()
export class UserInviteService {
  constructor(
    @InjectRepository(UserInviteRepository)
    private userInviteRepository: UserInviteRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createInviteForUser(): Promise<UserInvite> {
    return this.userInviteRepository.createUserInvite();
  }

  async activateUserAccount(inviteToken: string) {
    const invite = await this.userInviteRepository.activate(inviteToken);
    const user = await this.userRepository.findOne({ invite });
    user.status = UserStatus.ACTIVE;
    return this.userRepository.save(user);
  }
}
