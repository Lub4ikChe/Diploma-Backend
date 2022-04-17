import { IsNotEmpty, IsString } from 'class-validator';

export class ToggleAddTrackToUserLikedDto {
  @IsNotEmpty()
  @IsString()
  trackId: string;
}
