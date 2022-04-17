import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AttachmentTypes } from 'src/attachment/enums/attachment-types.enum';
import { AttachmentFolderTypes } from 'src/attachment/enums/attachment-folder-types.enum';

import { UserInformation } from 'src/entities/user-information/user-information.entity';
import { Track } from 'src/entities/track/track.entity';
import { Album } from 'src/entities/album/album.entity';

@Entity()
export class Attachment extends BaseEntity {
  url: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: AttachmentTypes;

  @Column({ name: 'folder_type' })
  folderType: AttachmentFolderTypes;

  @Column({ name: 'original_name' })
  originalName: string;

  @OneToOne(() => UserInformation, userInformation => userInformation.photo)
  userInformation: UserInformation;

  @OneToOne(() => Track, track => track.audio)
  trackAudio: Track;

  @OneToOne(() => Track, track => track.image)
  trackImage: Track;

  @OneToOne(() => Album, album => album.image)
  albumImage: Album;

  @AfterLoad()
  setSignedUrl() {
    this.url = `${process.env.SERVER_URL}/${this.folderType}/${this.type}/${this.name}`;
  }
}
