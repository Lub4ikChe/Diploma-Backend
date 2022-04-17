import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class AddTracksToAlbumDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  trackIds: string[];
}
