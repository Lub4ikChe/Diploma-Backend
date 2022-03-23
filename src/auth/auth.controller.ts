import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';

import { AuthService } from './services/auth.service';

import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { SignInDto } from 'src/auth/dto/sign-in.dto';

import { Tokens } from 'src/auth/jwt/tokens.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @Post('/signout')
  @UseGuards(AuthGuard('at-jwt'))
  @HttpCode(HttpStatus.OK)
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true })
    response: Response,
  ): Promise<void> {
    const email = req.user['email'];
    response.clearCookie('refresh-jwt');
    return this.authService.signOut(email);
  }

  @Post('/refresh')
  @UseGuards(AuthGuard('rt-jwt'))
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true })
    response: Response,
  ): Promise<Tokens> {
    const email = req.user['email'];
    const refreshToken = req.cookies['refresh-jwt'];
    const tokens = await this.authService.refreshTokens(email, refreshToken);
    response.cookie('refresh-jwt', tokens.refreshToken);
    return tokens;
  }

  @Get('/activate/:inviteToken')
  @UseGuards(AuthGuard('at-jwt'))
  @HttpCode(HttpStatus.OK)
  async activateUserAccount(
    @Param('inviteToken') inviteToken: string,
  ): Promise<void> {
    return this.authService.activateUserAccount(inviteToken);
  }
}
