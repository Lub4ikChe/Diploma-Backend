import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserInformation } from 'src/entities/user-information/user-information.entity';

import { CreateUserInformationDto } from 'src/user/user-information/dto/create-user-information.dto';
import { UpdateUserInformationDto } from 'src/user/user-information/dto/update-user-information.dto';
import { UserInformationDto } from 'src/user/user-information/dto/user-information.dto';

@Injectable()
export class UserInformationService {
  constructor(
    @InjectRepository(UserInformation)
    private userInformationRepository: Repository<UserInformation>,
  ) {}

  async getUserInfo(userId: string): Promise<UserInformationDto> {
    const userInfo = await this.userInformationRepository.findOne({
      userId,
    });

    if (!userInfo) {
      throw new NotFoundException();
    }

    return new UserInformationDto(userInfo);
  }

  async createUserInfo(
    createUserInformationDto: CreateUserInformationDto,
    userId: string,
  ): Promise<UserInformationDto> {
    const userInfoCandidate = await this.userInformationRepository.findOne({
      userId,
    });

    if (userInfoCandidate) {
      throw new ConflictException('User is already has some information');
    }

    const userInfo = this.userInformationRepository.create();
    const { firstName, lastName } = createUserInformationDto;

    userInfo.userId = userId;
    userInfo.firstName = firstName;
    userInfo.lastName = lastName;

    await userInfo.save();
    return new UserInformationDto(userInfo);
  }

  async updateUserInfo(
    updateUserInformationDto: UpdateUserInformationDto,
    userId: string,
  ): Promise<UserInformationDto> {
    const userInfo = await this.userInformationRepository.findOne({
      userId,
    });

    if (!userInfo) {
      return this.createUserInfo(updateUserInformationDto, userId);
    }

    const { firstName, lastName } = updateUserInformationDto;

    userInfo.firstName = firstName;
    userInfo.lastName = lastName;

    await userInfo.save();
    return new UserInformationDto(userInfo);
  }
}
