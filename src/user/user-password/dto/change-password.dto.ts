import { IsNotEmpty, IsString } from 'class-validator';

import { PasswordDto } from 'src/utils/password.dto';

export class ChangePasswordDto extends PasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;
}
