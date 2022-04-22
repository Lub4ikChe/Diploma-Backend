import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Generated,
  JoinColumn,
} from 'typeorm';

import { User } from 'src/entities/user/user.entity';

@Entity()
export class ResetPassword extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  token: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column()
  used: boolean;

  @ManyToOne(() => User, user => user.resetPasswords)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;
}
