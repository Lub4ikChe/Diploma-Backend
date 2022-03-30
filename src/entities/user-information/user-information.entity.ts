import {
  BaseEntity,
  JoinColumn,
  PrimaryGeneratedColumn,
  Unique,
  AfterLoad,
  Column,
  Entity,
  OneToOne,
} from 'typeorm';
import { User } from 'src/entities/user/user.entity';
import { Attachment } from 'src/entities/attachment/attachment.entity';

@Entity()
@Unique(['userId'])
export class UserInformation extends BaseEntity {
  name: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ nullable: true, name: 'last_name' })
  lastName: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User, user => user.information, { eager: false })
  user: User;

  @OneToOne(() => Attachment, attachment => attachment.userInformation, {
    eager: true,
  })
  @JoinColumn([{ name: 'attachment_id', referencedColumnName: 'id' }])
  photo: Attachment;

  @AfterLoad()
  setName() {
    this.name = `${this.firstName || ''} ${this.lastName || ''}`;
  }
}
