import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AttachmentTypes } from 'src/attachment/enums/attachment-types.enum';

import { UserInformation } from 'src/entities/user-information/user-information.entity';

@Entity()
export class Attachment extends BaseEntity {
  url: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: AttachmentTypes;

  @Column({ name: 'original_name' })
  originalName: string;

  @OneToOne(() => UserInformation, userInformation => userInformation.photo)
  userInformation: UserInformation;

  @AfterLoad()
  setSignedUrl() {
    this.url = `${process.env.SERVER_URL}/photos/${this.name}`;
  }
}
