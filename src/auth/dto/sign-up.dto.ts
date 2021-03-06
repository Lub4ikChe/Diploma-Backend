import { IsEmail, IsNotEmpty } from 'class-validator';

import { PasswordDto } from 'src/utils/password.dto';

export class SignUpDto extends PasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
