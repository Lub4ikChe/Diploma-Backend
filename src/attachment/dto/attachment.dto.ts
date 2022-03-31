import { Exclude, Expose } from 'class-transformer';

import { BaseDto } from 'src/utils/base.dto';

import { Attachment } from 'src/entities/attachment/attachment.entity';

@Exclude()
export class AttachmentDto extends BaseDto<Attachment> {
  @Expose()
  id: string;

  @Expose()
  url: string;

  @Expose()
  originalName: string;
}
