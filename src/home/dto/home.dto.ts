import { Exclude, Expose, Transform } from 'class-transformer';

import { TrackDto } from 'src/track/dto/track.dto';
import { AlbumDto } from 'src/album/dto/album.dto';

import { Track } from 'src/entities/track/track.entity';
import { Album } from 'src/entities/album/album.entity';

interface ArgsType {
  tracks: Track[];
  albums: Album[];
}

@Exclude()
export class HomeDto {
  constructor(args: ArgsType) {
    Object.assign(this, args);
  }

  @Expose()
  @Transform(
    prop => prop.value && prop.value.map((track: Track) => new TrackDto(track)),
  )
  tracks: TrackDto[];

  @Expose()
  @Transform(
    prop => prop.value && prop.value.map((album: Album) => new AlbumDto(album)),
  )
  albums: AlbumDto[];
}
