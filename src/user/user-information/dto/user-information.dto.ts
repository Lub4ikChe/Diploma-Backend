import { Exclude, Expose, Transform } from 'class-transformer';

import { BaseDto } from 'src/utils/base.dto';
import { AttachmentDto } from 'src/attachment/dto/attachment.dto';

import { UserInformation } from 'src/entities/user-information/user-information.entity';

@Exclude()
export class UserInformationDto extends BaseDto<UserInformation> {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(prop => prop.value && new AttachmentDto(prop.value))
  photo: AttachmentDto;
}
