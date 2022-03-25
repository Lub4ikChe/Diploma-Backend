import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserInviteService } from 'src/user/services/user-invite.service';

import { User } from 'src/entities/user/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';

import { UserStatus } from 'src/user/enums/user-status.enum';

import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { SignInDto } from 'src/auth/dto/sign-in.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private userInviteService: UserInviteService,
  ) {}

  async createUser(
    signUpDto: SignUpDto,
    userStatus: UserStatus,
  ): Promise<User> {
    const user = await this.userRepository.createUser(signUpDto, userStatus);
    const invite = await this.userInviteService.createInviteForUser();
    user.invite = invite;
    return this.userRepository.save(user);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne(
      { email },
      { select: ['id', 'email', 'status'] },
    );
  }

  async validateUser(signInDto: SignInDto): Promise<User> {
    const { email, password } = signInDto;
    const user = await this.userRepository.findOne(
      { email },
      { select: ['id', 'email', 'status', 'password', 'refreshToken'] },
    );

    if (!user) {
      throw new ForbiddenException('Email is wrong');
    }

    const passwordMatches = await this.userRepository.validateUserPassword(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new ForbiddenException('Password is wrong');
    }

    if (user.status === UserStatus.PENDING_ACTIVATION) {
      throw new ForbiddenException('Activate your account');
    }

    return user;
  }

  async removeUserWithRelations(user: User) {
    return this.userRepository.remove(user);
  }
}
