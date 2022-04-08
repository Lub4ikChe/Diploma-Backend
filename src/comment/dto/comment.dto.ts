import { Exclude, Expose, Transform } from 'class-transformer';

import { BaseDto } from 'src/utils/base.dto';
import { UserDto } from 'src/user/dto/user.dto';

import { Comment } from 'src/entities/comment/comment.entity';

@Exclude()
export class CommentDto extends BaseDto<Comment> {
  @Expose()
  id: string;

  @Expose()
  text: string;

  @Expose()
  listensCount: number;

  @Expose()
  uploadedAt: Date;

  @Expose()
  @Transform(prop => prop.value && new UserDto(prop.value))
  author: UserDto;
}
