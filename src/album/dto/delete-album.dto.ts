import { IsBoolean, IsNotEmpty } from 'class-validator';

export class DeleteAlbumDto {
  @IsNotEmpty()
  @IsBoolean()
  deleteWithTrack: boolean;
}
