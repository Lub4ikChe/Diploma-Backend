import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from 'src/auth/services/auth.service';

import { RtGuard } from 'src/auth/guards/rt-guard.decorator';
import { SkipAuth } from 'src/auth/decorators/skip-auth.decorator';

import { GetJWTPayload } from 'src/auth/decorators/get-jwt-payload.decorator';
import { GetCookieData } from 'src/auth/decorators/get-cookie-data.decorator';

import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { SignInDto } from 'src/auth/dto/sign-in.dto';

import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import { Tokens } from 'src/auth/jwt/tokens.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Tokens> {
    const tokens = await this.authService.signUp(signUpDto);
    response.cookie('refresh-jwt', tokens.refreshToken);
    return tokens;
  }

  @Get('/activate/:inviteToken')
  @HttpCode(HttpStatus.OK)
  async activateUserAccount(
    @Param('inviteToken') inviteToken: string,
  ): Promise<void> {
    return this.authService.activateUserAccount(inviteToken);
  }

  @SkipAuth()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Tokens> {
    const tokens = await this.authService.signIn(signInDto);
    response.cookie('refresh-jwt', tokens.refreshToken);
    return tokens;
  }

  @SkipAuth()
  @Get('/refresh')
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Res({ passthrough: true }) response: Response,
    @GetJWTPayload() jwtPayload: JwtPayload,
    @GetCookieData('refresh-jwt') refreshToken: string,
  ): Promise<Tokens> {
    const tokens = await this.authService.refreshTokens(
      jwtPayload.email,
      refreshToken,
    );
    response.cookie('refresh-jwt', tokens.refreshToken);
    return tokens;
  }

  @Post('/signout')
  @HttpCode(HttpStatus.OK)
  async signOut(
    @Res({ passthrough: true }) response: Response,
    @GetJWTPayload() jwtPayload: JwtPayload,
  ): Promise<void> {
    response.clearCookie('refresh-jwt');
    return this.authService.signOut(jwtPayload.email);
  }
}
