import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from 'src/user/services/user.service';
import { UserInviteService } from 'src/user/services/user-invite.service';
import { AuthTokenService } from 'src/auth/services/auth.token.service';

import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { SignInDto } from 'src/auth/dto/sign-in.dto';

import { UserStatus } from 'src/user/enums/user-status.enum';
import { Tokens } from 'src/auth/jwt/tokens.interface';
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import { User } from 'src/entities/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userInviteService: UserInviteService,
    private authTokenService: AuthTokenService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<Tokens> {
    const { email } = signUpDto;
    const candidate = await this.userService.getUserByEmail(email);
    if (candidate) {
      throw new ConflictException('User with that email already exists');
    }

    const user = await this.userService.createUser(
      signUpDto,
      UserStatus.PENDING_ACTIVATION,
    );

    try {
      await this.userInviteService.sendConfirmEmail({
        to: email,
        inviteToken: user.invite.token,
      });
    } catch (error) {
      await this.userService.removeUserWithRelations(user);
      throw error;
    }

    const tokens = await this.getTokens(user);

    await this.authTokenService.addRefreshTokenToUser(
      user,
      tokens.refreshToken,
    );

    return tokens;
  }

  async signIn(signInDto: SignInDto): Promise<Tokens> {
    const user = await this.userService.validateUser(signInDto);
    const tokens = await this.getTokens(user);

    await this.authTokenService.updateRefreshTokenForUser(
      user.refreshToken,
      tokens.refreshToken,
    );

    return tokens;
  }

  async signOut(email: string) {
    const userWithRefreshToke = await this.userService.getUserRefreshToken(
      email,
    );

    await this.authTokenService.updateRefreshTokenForUser(
      userWithRefreshToke.refreshToken,
      null,
    );

    return null;
  }

  async refreshTokens(email: string, refreshToken: string): Promise<Tokens> {
    const userWithRefreshToke = await this.userService.getUserRefreshToken(
      email,
    );

    if (!userWithRefreshToke) {
      throw new ForbiddenException('Access denied');
    }

    const refreshTokenMatches =
      await this.authTokenService.compareRefreshTokens(
        refreshToken,
        userWithRefreshToke.refreshToken,
      );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(userWithRefreshToke);
    await this.authTokenService.updateRefreshTokenForUser(
      userWithRefreshToke.refreshToken,
      tokens.refreshToken,
    );

    return tokens;
  }

  async activateUserAccount(inviteToken: string): Promise<void> {
    await this.userInviteService.activateUserAccount(inviteToken);
    return null;
  }

  async getJwtUser(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private async getTokens(user: User): Promise<Tokens> {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };
    return this.authTokenService.generateTokens(payload);
  }
}
