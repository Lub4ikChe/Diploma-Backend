import { Exclude, Expose } from 'class-transformer';
import { BaseDto } from 'src/utils/base.dto';

import { Attachment } from 'src/entities/attachments/attachment.entity';
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
  photo: Attachment;
}
