import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserStatus } from 'src/user/enums/user-status.enum';

import { UserInvite } from 'src/entities/user/user-invite.entity';
import { RefreshToken } from 'src/entities/refresh-token/refresh-token.entity';

@Unique(['email'])
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  status: UserStatus;

  @Column({ select: false })
  password: string;

  @Column({ select: false })
  salt: string;

  @OneToOne(() => UserInvite, userInvite => userInvite.user, {
    eager: true,
  })
  @JoinColumn([{ name: 'user_invite_id', referencedColumnName: 'id' }])
  invite: UserInvite;

  @OneToOne(() => RefreshToken, refreshToken => refreshToken.user, {
    eager: true,
  })
  @JoinColumn([{ name: 'user_refresh_token_id', referencedColumnName: 'id' }])
  refreshToken: RefreshToken;
}
