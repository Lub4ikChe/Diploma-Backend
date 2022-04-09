import { Exclude, Expose, Transform } from 'class-transformer';

import { BaseDto } from 'src/utils/base.dto';
import { AttachmentDto } from 'src/attachment/dto/attachment.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { CommentDto } from 'src/comment/dto/comment.dto';

import { Comment } from 'src/entities/comment/comment.entity';
import { Track } from 'src/entities/track/track.entity';

@Exclude()
export class TrackDto extends BaseDto<Track> {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  text: string;

  @Expose()
  listensCount: number;

  @Expose()
  uploadedAt: Date;

  @Expose()
  @Transform(prop => prop.value && new UserDto(prop.value))
  uploadedBy: UserDto;

  @Expose()
  @Transform(prop => prop.value && new AttachmentDto(prop.value))
  audio: AttachmentDto;

  @Expose()
  @Transform(prop => prop.value && new AttachmentDto(prop.value))
  image: AttachmentDto;

  @Expose()
  @Transform(
    prop =>
      prop.value &&
      prop.value.map(
        (requestCompany: Comment) => new CommentDto(requestCompany),
      ),
  )
  comments: CommentDto[];
}
