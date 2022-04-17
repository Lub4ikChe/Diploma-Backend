import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/entities/user/user.entity';
import { Attachment } from 'src/entities/attachment/attachment.entity';
import { Comment } from 'src/entities/comment/comment.entity';
import { Album } from 'src/entities/album/album.entity';

@Entity()
export class Track extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  text: string;

  @Column({ name: 'listens_count', default: 0 })
  listensCount: number;

  @CreateDateColumn({ type: 'timestamp', name: 'uploaded_at' })
  uploadedAt: Date;

  @ManyToOne(() => User, user => user.uploadedTracks, { eager: true })
  @JoinColumn({
    name: 'uploaded_by_id',
    referencedColumnName: 'id',
  })
  uploadedBy: User;

  @OneToOne(() => Attachment, attachment => attachment.trackAudio, {
    eager: true,
  })
  @JoinColumn([{ name: 'audio_attachment_id', referencedColumnName: 'id' }])
  audio: Attachment;

  @OneToOne(() => Attachment, attachment => attachment.trackImage, {
    eager: true,
  })
  @JoinColumn([{ name: 'image_attachment_id', referencedColumnName: 'id' }])
  image: Attachment;

  @OneToMany(() => Comment, comment => comment.track, { eager: true })
  comments: Comment[];

  @ManyToOne(() => Album, album => album.tracks, { nullable: true })
  @JoinColumn({
    name: 'album_id',
    referencedColumnName: 'id',
  })
  album: Album;
}
