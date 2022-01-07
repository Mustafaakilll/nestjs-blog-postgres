import { LoginDTO } from './login.dto';
import { IsString, MinLength } from 'class-validator';

export class RegisterDTO extends LoginDTO {
  @IsString()
  @MinLength(4)
  username: string;
}
