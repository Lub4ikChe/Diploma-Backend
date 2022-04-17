import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/entities/user/user.entity';
import { Attachment } from 'src/entities/attachment/attachment.entity';
import { Track } from 'src/entities/track/track.entity';

@Entity()
export class Album extends BaseEntity {
  listensCount = 0;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => Attachment, attachment => attachment.albumImage, {
    eager: true,
  })
  @JoinColumn([{ name: 'image_attachment_id', referencedColumnName: 'id' }])
  image: Attachment;

  @ManyToOne(() => User, user => user.uploadedAlbums, { eager: true })
  @JoinColumn({
    name: 'author_id',
    referencedColumnName: 'id',
  })
  author: User;

  @OneToMany(() => Track, track => track.album, { eager: true })
  tracks: Track[];

  @AfterLoad()
  setSignedUrl() {
    this.listensCount = this.tracks.reduce(
      (previousValue, track) => previousValue + track.listensCount,
      0,
    );
  }
}
