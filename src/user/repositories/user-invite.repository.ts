import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { UserInvite } from 'src/entities/user/user-invite.entity';

@EntityRepository(UserInvite)
export class UserInviteRepository extends Repository<UserInvite> {
  async createUserInvite(): Promise<UserInvite> {
    const invite = this.create();
    return this.save(invite);
  }

  async activate(inviteToken: string) {
    const userInvite = await this.findOne({ token: inviteToken });
    if (!userInvite) {
      throw new NotFoundException('Invite not found');
    }

    if (userInvite.used) {
      throw new ConflictException('Invite is already used');
    }
    userInvite.used = true;
    return this.save(userInvite);
  }
}
