import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserInviteService } from 'src/user/services/user-invite.service';

import { User } from 'src/entities/user/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';

import { UserStatus } from 'src/user/enums/user-status.enum';

import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { SignInDto } from 'src/auth/dto/sign-in.dto';
import { UserWithLatestMediaDto } from 'src/user/dto/user-with-latest-media.dto';
import { UserWithMediaDto } from 'src/user/dto/user-with-media.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { GetUserDto } from 'src/user/dto/get-user.dto';

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
      { select: ['id', 'email', 'status'], relations: ['information'] },
    );
  }

  async getUserById(id: string): Promise<UserWithLatestMediaDto> {
    const user = await this.userRepository.findOne(
      { id },
      {
        select: ['id', 'email', 'status'],
        relations: [
          'information',
          'uploadedTracks',
          'uploadedTracks.uploadedBy',
          'uploadedTracks.uploadedBy.information',
          'uploadedAlbums',
          'uploadedAlbums.author',
          'uploadedAlbums.author.information',
        ],
      },
    );

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    return new UserWithLatestMediaDto(user);
  }

  async getMeUserWithMedia(id: string): Promise<UserWithMediaDto> {
    const user = await this.userRepository.findOne(
      { id },
      {
        select: ['id', 'email', 'status'],
        relations: [
          'information',
          'likedTracks',
          'likedTracks.uploadedBy',
          'likedTracks.uploadedBy.information',
          'uploadedTracks',
          'uploadedTracks.album',
          'uploadedTracks.uploadedBy',
          'uploadedTracks.uploadedBy.information',
          'uploadedAlbums',
          'uploadedAlbums.author',
          'uploadedAlbums.author.information',
        ],
      },
    );

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    return new UserWithMediaDto(user);
  }

  async getUsers(getUserDto: GetUserDto): Promise<[UserDto[], number]> {
    const { search, page = 0, limit = 10 } = getUserDto;

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.information', 'userInformation')
      .leftJoinAndSelect('userInformation.photo', 'userInformationPhoto')
      .leftJoin('user.uploadedTracks', 'userUploadedTracks');

    if (search) {
      query.andWhere(
        '' +
          ' userInformation.firstName ILIKE :search OR' +
          ' userInformation.lastName ILIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    if (page >= 0 && limit) {
      query.skip(page * limit).take(limit);
    }

    const [users, total] = await query.getManyAndCount();

    return [users.map(user => new UserDto(user)), total];
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
