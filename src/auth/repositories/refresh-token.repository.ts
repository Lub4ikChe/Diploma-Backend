import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { RefreshToken } from 'src/entities/refresh-token/refresh-token.entity';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
  async createRefreshToken(token: string): Promise<RefreshToken> {
    const refreshToken = this.create();
    refreshToken.hash = await bcrypt.hash(token, 10);
    return this.save(refreshToken);
  }

  async updateRefreshToken(
    refreshToken: RefreshToken,
    token: string | null,
  ): Promise<RefreshToken> {
    let newValue: string | null = null;
    if (token) {
      newValue = await bcrypt.hash(token, 10);
    }
    refreshToken.hash = newValue;
    return this.save(refreshToken);
  }

  async compareRefreshTokens(
    refreshToken: string,
    userRefreshTokenHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(refreshToken, userRefreshTokenHash);
  }
}
