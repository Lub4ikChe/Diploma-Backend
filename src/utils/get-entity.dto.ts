import { IsOptional, IsString } from 'class-validator';

export class GetEntityDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  page: number;

  @IsOptional()
  @IsString()
  limit: number;
}
