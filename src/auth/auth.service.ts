import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { AuthResponseDTO } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async register(credentials: RegisterDTO): Promise<AuthResponseDTO> {
    try {
      const user = this.userRepo.create(credentials);
      await user.save();
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      return { user: user.toJSON(), token: token };
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Username already have been taken');
      }
      throw new BadRequestException('Something went wrong about registering');
    }
  }

  async login({ email, password }: LoginDTO): Promise<AuthResponseDTO> {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new BadRequestException('Your email or password are wrong');
      }
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      return { user: user.toJSON(), token: token };
    } catch (e) {
      throw new BadRequestException('Your email or password are wrong');
    }
  }

  async findCurrentUser(username: string): Promise<AuthResponseDTO> {
    const user = await this.userRepo.findOne({ where: { username } });
    const payload = { username };
    const token = this.jwtService.sign(payload);
    return { user: user, token: token };
  }
}
