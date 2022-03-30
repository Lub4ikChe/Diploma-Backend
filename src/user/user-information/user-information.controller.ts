import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Put,
  Get,
} from '@nestjs/common';

import { UserInformationService } from 'src/user/user-information/user-information.service';

import { GetJWTPayload } from 'src/auth/decorators/get-jwt-payload.decorator';
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';

import { CreateUserInformationDto } from 'src/user/user-information/dto/create-user-information.dto';
import { UpdateUserInformationDto } from 'src/user/user-information/dto/update-user-information.dto';
import { UserInformationDto } from 'src/user/user-information/dto/user-information.dto';

@Controller('user/information')
export class UserInformationController {
  constructor(private userInformationService: UserInformationService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserInfo(
    @GetJWTPayload() jwtPayload: JwtPayload,
  ): Promise<UserInformationDto> {
    return this.userInformationService.getUserInfo(jwtPayload.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUserInfo(
    @Body() createUserInformationDto: CreateUserInformationDto,
    @GetJWTPayload() jwtPayload: JwtPayload,
  ): Promise<UserInformationDto> {
    return this.userInformationService.createUserInfo(
      createUserInformationDto,
      jwtPayload.userId,
    );
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async updateUserInfo(
    @Body() updateUserInformationDto: UpdateUserInformationDto,
    @GetJWTPayload() jwtPayload: JwtPayload,
  ): Promise<UserInformationDto> {
    return this.userInformationService.updateUserInfo(
      updateUserInformationDto,
      jwtPayload.userId,
    );
  }
}
