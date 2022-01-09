import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileResponseDTO } from './dto/profile-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDTO } from '../auth/dto/auth-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async findByUsername(
    username: string,
    user?: UserEntity,
  ): Promise<ProfileResponseDTO> {
    const profile = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });

    return profile.toProfile(user);
  }

  async followUser(
    currentUser: UserEntity,
    username: string,
  ): Promise<ProfileResponseDTO> {
    if (currentUser.username === username) {
      throw new BadRequestException('You cant follow yourself');
    }
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });
    user.followers.push(currentUser);
    await user.save();
    return user.toProfile(currentUser);
  }

  async unfollowUser(
    currentUser: UserEntity,
    username: string,
  ): Promise<ProfileResponseDTO> {
    if (currentUser.username === username)
      throw new BadRequestException('You cant unfollow yourself');
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['follower'],
    });
    user.followers = user.followers.filter(
      (follower) => follower.id !== currentUser.id,
    );
    await user.save();
    return user.toProfile(currentUser);
  }

  async updateUser(
    username: string,
    data: UpdateUserDto,
  ): Promise<AuthResponseDTO> {
    await this.userRepo.update({ username }, data);
    const user = await this.userRepo.findOne({ where: { username } });
    const payload = { username };
    const token = this.jwtService.sign(payload);
    return { ...user.toJSON(), token };
  }
}
