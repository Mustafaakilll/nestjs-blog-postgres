import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthPayload } from '../auth/dto/auth-payload.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: AuthPayload): Promise<UserEntity[]> {
    const { username } = payload;
    const user = this.userRepo.find({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('There is no account for this username');
    }
    return user;
  }
}
