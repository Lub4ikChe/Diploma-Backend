import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/entities/user/user.entity';
import { Track } from 'src/entities/track/track.entity';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => User, user => user.comments, {
    eager: true,
  })
  @JoinColumn([{ name: 'author_id', referencedColumnName: 'id' }])
  author: User;

  @ManyToOne(() => Track, track => track.comments, {
    eager: false,
    nullable: true,
  })
  @JoinColumn([{ name: 'track_id', referencedColumnName: 'id' }])
  track: Track;
}
