import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/entities/user/user.entity';

@Entity()
export class UserInvite extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  token: string;

  @Column({ default: false })
  used: boolean;

  @OneToOne(() => User, user => user.invite)
  user: User;
}
