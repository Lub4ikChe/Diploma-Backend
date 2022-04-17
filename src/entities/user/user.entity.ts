import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserStatus } from 'src/user/enums/user-status.enum';

import { UserInvite } from 'src/entities/user/user-invite.entity';
import { RefreshToken } from 'src/entities/refresh-token/refresh-token.entity';
import { UserInformation } from 'src/entities/user-information/user-information.entity';
import { Track } from 'src/entities/track/track.entity';
import { Comment } from 'src/entities/comment/comment.entity';
import { Album } from 'src/entities/album/album.entity';

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

  @OneToOne(() => UserInformation, userInformation => userInformation.user, {
    eager: false,
  })
  @JoinColumn([{ name: 'user_information_id', referencedColumnName: 'id' }])
  information: UserInformation;

  @OneToMany(() => Track, track => track.uploadedBy)
  uploadedTracks: Track[];

  @OneToMany(() => Comment, comment => comment.author, { eager: false })
  comments: Comment[];

  @OneToMany(() => Album, album => album.author)
  uploadedAlbums: Album[];

  @ManyToMany(() => Track, track => track.likedByUsers)
  @JoinTable({
    name: 'user_liked_tracks',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'track_id', referencedColumnName: 'id' },
  })
  likedTracks: Track[];
}
