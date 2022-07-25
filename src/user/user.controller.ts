import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../helper/user.decorator';
import { UserEntity } from './entities/user.entity';
import { ProfileResponseDTO } from './dto/profile-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthResponseDTO } from '../auth/dto/auth-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:username')
  @UseGuards(AuthGuard())
  async findByUsername(
    @Param('username') username: string,
    @User() user: UserEntity,
  ): Promise<{ profile: ProfileResponseDTO }> {
    const profile = await this.userService.findByUsername(username, user);
    return { profile };
  }

  @Get('/:username/follow')
  @UseGuards(AuthGuard())
  async followUser(
    @Param('username') username: string,
    @User() user: UserEntity,
  ): Promise<{ profile: ProfileResponseDTO }> {
    const profile = await this.userService.followUser(user, username);
    return { profile };
  }

  @Get('/:username/unfollow')
  @UseGuards(AuthGuard())
  async unfollowUser(
    @Param('username') username: string,
    @User() user: UserEntity,
  ): Promise<{ profile: ProfileResponseDTO }> {
    const profile = await this.userService.unfollowUser(user, username);
    return { profile };
  }

  @Put()
  @UseGuards(AuthGuard())
  async updateUser(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    data: UpdateUserDto,
    @User() { username }: UserEntity,
  ): Promise<{ user: AuthResponseDTO }> {
    // TODO: Look here for change `updatedAt` field
    const user = await this.userService.updateUser(username, data);
    return { user };
  }
}
