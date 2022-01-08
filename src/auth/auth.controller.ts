import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { AuthResponseDTO } from './dto/auth-response.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(
    @Body(ValidationPipe) credentials: RegisterDTO,
  ): Promise<{ user: AuthResponseDTO }> {
    const user = await this.authService.register(credentials);
    return { user };
  }

  @Post('/login')
  async login(
    @Body('user', ValidationPipe) credentials: LoginDTO,
  ): Promise<{ user: AuthResponseDTO }> {
    const user = await this.authService.login(credentials);
    return { user };
  }

  @Get('/me')
  async findCurrentUser(@Query('username') username: string) {
    const user = await this.authService.findCurrentUser(username);
    return { user };
  }
}
