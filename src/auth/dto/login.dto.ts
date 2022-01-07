import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @MinLength(4)
  @IsString()
  email: string;

  @MinLength(4)
  @IsString()
  password: string;
}
