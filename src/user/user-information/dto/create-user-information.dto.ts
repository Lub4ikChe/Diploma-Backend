import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserInformationDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
