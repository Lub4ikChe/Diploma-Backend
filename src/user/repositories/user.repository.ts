import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { UserStatus } from 'src/user/enums/user-status.enum';
import { User } from 'src/entities/user/user.entity';

import { SignUpDto } from 'src/auth/dto/sign-up.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(signUpDto: SignUpDto, status: UserStatus): Promise<User> {
    const { email, password } = signUpDto;
    const user = this.create();

    user.email = email.toLowerCase();
    user.status = status;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);

    return user.save();
  }

  async validateUserPassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
