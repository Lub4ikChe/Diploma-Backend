import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  text: string;
}
