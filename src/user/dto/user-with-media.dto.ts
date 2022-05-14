import { Exclude, Expose, Transform } from 'class-transformer';

import { UserDto } from 'src/user/dto/user.dto';
import { TrackDto } from 'src/track/dto/track.dto';
import { AlbumDto } from 'src/album/dto/album.dto';

import { Track } from 'src/entities/track/track.entity';
import { Album } from 'src/entities/album/album.entity';

@Exclude()
export class UserWithMediaDto extends UserDto {
  @Expose()
  @Transform(
    prop => prop.value && prop.value.map((track: Track) => new TrackDto(track)),
  )
  likedTracks: TrackDto[];

  @Expose()
  @Transform(
    prop =>
      prop.value &&
      prop.value
        .map((track: Track) => new TrackDto(track))
        .sort(
          (a: Track, b: Track) =>
            b.uploadedAt.getTime() - a.uploadedAt.getTime(),
        ),
  )
  uploadedTracks: TrackDto[];

  @Expose()
  @Transform(
    prop => prop.value && prop.value.map((album: Album) => new AlbumDto(album)),
  )
  uploadedAlbums: AlbumDto[];
}
