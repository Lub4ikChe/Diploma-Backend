import { Exclude, Expose, Transform } from 'class-transformer';

import { BaseDto } from 'src/utils/base.dto';
import { AttachmentDto } from 'src/attachment/dto/attachment.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { TrackDto } from 'src/track/dto/track.dto';

import { Track } from 'src/entities/track/track.entity';
import { Album } from 'src/entities/album/album.entity';

@Exclude()
export class AlbumDto extends BaseDto<Album> {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  listensCount: number;

  @Expose()
  @Transform(prop => prop.value && new AttachmentDto(prop.value))
  image: AttachmentDto;

  @Expose()
  @Transform(prop => prop.value && new UserDto(prop.value))
  author: UserDto;

  @Expose()
  @Transform(
    prop => prop.value && prop.value.map((track: Track) => new TrackDto(track)),
  )
  tracks: TrackDto[];
}
