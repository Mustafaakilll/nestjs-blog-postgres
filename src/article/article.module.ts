import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { ArticleEntity } from './entities/article.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { TagEntity } from './entities/tag.entity';
import { CommentService } from './comment.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, CommentService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      CommentEntity,
      ArticleEntity,
      UserEntity,
      TagEntity,
    ]),
  ],
})
export class ArticleModule {}
