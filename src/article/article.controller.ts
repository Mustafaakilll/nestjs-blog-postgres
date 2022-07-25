import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { OptionalAuthGuard } from '../helper/optional-auth.guard';
import { User } from '../helper/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { FindAllQuery } from './dto/find-all-query.dto';
import { ArticleResponseDTO } from './dto/article-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { FindFeedQuery } from './dto/find-feed-query.dto';
import { CreateArticleDTO } from './dto/create-article.dto';
import { UpdateArticleDTO } from './dto/update-article.dto';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { CommentResponseDTO } from './dto/comment-response.dto';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
  ) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async findAll(
    @User() user: UserEntity,
    @Query() query: FindAllQuery,
  ): Promise<{ articles: ArticleResponseDTO[]; count: number }> {
    const articles = await this.articleService.findAll(user, query);
    return { articles, count: articles.length };
  }

  @Get('/feed')
  @UseGuards(AuthGuard())
  async findFeed(
    @User() user: UserEntity,
    @Query() query: FindFeedQuery,
  ): Promise<{ count: number; articles: ArticleResponseDTO[] }> {
    const articles = await this.articleService.findFeed(user, query);
    return { articles, count: articles.length };
  }

  @Get('/:id')
  @UseGuards(OptionalAuthGuard)
  async findById(
    @User() user: UserEntity,
    @Param('id') id: number,
  ): Promise<{ article: ArticleResponseDTO }> {
    const article = await this.articleService.findById(id);
    return { article: article.toArticle(user) };
  }

  @Post()
  @UseGuards(AuthGuard())
  async createArticle(
    @Body(ValidationPipe) data: CreateArticleDTO,
    @User() user: UserEntity,
  ): Promise<{ article: ArticleResponseDTO }> {
    const article = await this.articleService.createArticle(user, data);
    return { article };
  }

  @Put('/:id')
  @UseGuards(AuthGuard())
  async updateArticle(
    @User() user: UserEntity,
    @Body() data: UpdateArticleDTO,
    @Param('id') id: number,
  ): Promise<{ article: ArticleResponseDTO }> {
    const article = await this.articleService.updateArticle(user, data, id);
    return { article };
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  async deleteArticle(
    @Param('id') id: number,
    @User() user: UserEntity,
  ): Promise<{ article: ArticleResponseDTO }> {
    const article = await this.articleService.deleteArticle(user, id);
    return { article };
  }

  @Get('/:id/favorite')
  @UseGuards(AuthGuard())
  async favoriteArticle(
    @Param('id') id: number,
    @User() user: UserEntity,
  ): Promise<{ article: ArticleResponseDTO }> {
    const article = await this.articleService.favoriteArticle(user, id);
    return { article };
  }

  @Get('/:id/unfavorite')
  @UseGuards(AuthGuard())
  async unfavoriteArticle(
    @Param('id') id: number,
    @User() user: UserEntity,
  ): Promise<{ article: ArticleResponseDTO }> {
    const article = await this.articleService.unfavoriteArticle(user, id);
    return { article };
  }

  @Get('/comment/:id')
  async findCommentsByArticle(
    @Param('id') id: number,
  ): Promise<{ article: CommentResponseDTO[] }> {
    const article = await this.commentService.findByArticleId(id);
    return { article };
  }

  @Post('/comment/:id')
  @UseGuards(AuthGuard())
  async createComment(
    @User() user: UserEntity,
    @Body(ValidationPipe) data: CreateCommentDTO,
    @Param('id') id: number,
  ): Promise<{ article: CommentResponseDTO }> {
    const article = await this.commentService.createComment(data, user, id);
    return { article };
  }

  @Delete('/comment/:id')
  @UseGuards(AuthGuard())
  async deleteComment(
    @User() user: UserEntity,
    @Param('id') id: number,
  ): Promise<void> {
    await this.commentService.deleteComment(id, user);
  }
}
