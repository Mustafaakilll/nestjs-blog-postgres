import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude, instanceToPlain } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

import { AbstractEntity } from '../../helper/base-entity';
import { IMAGE_URL } from '../../helper/constants';
import { ArticleEntity } from '../../article/entities/article.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { UserResponseDTO } from '../dto/user-response.dto';
import { ProfileResponseDTO } from '../dto/profile-response.dto';

@Entity('user')
export class UserEntity extends AbstractEntity {
  @Column({ unique: true })
  username: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: IMAGE_URL })
  image: string;

  @ManyToMany(() => UserEntity, (user) => user.followee)
  @JoinTable()
  followers: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.followers)
  followee: UserEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.id)
  articles: ArticleEntity[];

  @ManyToMany(() => ArticleEntity, (article) => article.favoritedBy)
  favorites: ArticleEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toJSON(): UserResponseDTO {
    return <UserResponseDTO>instanceToPlain(this);
  }

  toProfile(user?: UserEntity): ProfileResponseDTO {
    let following = null;
    if (user) {
      following = this.followers.includes(user);
    }
    const profile: any = this.toJSON();
    return { ...profile, following };
  }
}
