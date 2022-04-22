import { IsNotEmpty, IsString } from 'class-validator';

import { PasswordDto } from 'src/utils/password.dto';

export class ResetPasswordDto extends PasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
