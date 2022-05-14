import { Exclude, Expose, Transform } from 'class-transformer';

import { BaseDto } from 'src/utils/base.dto';
import { UserInformationDto } from 'src/user/user-information/dto/user-information.dto';
import { User } from 'src/entities/user/user.entity';

@Exclude()
export class UserDto extends BaseDto<User> {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  status: string;

  @Expose()
  @Transform(prop => prop.value && new UserInformationDto(prop.value))
  information: UserInformationDto;
}
