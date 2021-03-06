import { IsString, Matches, MinLength } from 'class-validator';

export class PasswordDto {
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  }) //1 upper case letter 1 lower case letter 1 number or special character
  password: string;
}
