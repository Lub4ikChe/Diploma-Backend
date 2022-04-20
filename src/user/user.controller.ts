import {
  Controller,
  HttpStatus,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common';

import { UserService } from 'src/user/services/user.service';

import { SkipAuth } from 'src/auth/decorators/skip-auth.decorator';
import { GetJWTPayload } from 'src/auth/decorators/get-jwt-payload.decorator';

import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';

import { UserDto } from 'src/user/dto/user.dto';
import { UserWithLatestMediaDto } from 'src/user/dto/user-with-latest-media.dto';
import { GetUserDto } from 'src/user/dto/get-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getMe(
    @GetJWTPayload() jwtPayload: JwtPayload,
  ): Promise<UserWithLatestMediaDto> {
    return this.userService.getUserById(jwtPayload.userId);
  }

  @SkipAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query() getUserDto: GetUserDto,
  ): Promise<[UserDto[], number]> {
    return this.userService.getUsers(getUserDto);
  }

  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Param('userId') userId: string,
  ): Promise<UserWithLatestMediaDto> {
    return this.userService.getUserById(userId);
  }
}
