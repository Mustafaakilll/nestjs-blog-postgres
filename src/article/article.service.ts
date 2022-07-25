import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { Like, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { FindAllQuery } from './dto/find-all-query.dto';
import { FindFeedQuery } from './dto/find-feed-query.dto';
import { ArticleResponseDTO } from './dto/article-response.dto';
import { CreateArticleDTO } from './dto/create-article.dto';
import { UpdateArticleDTO } from './dto/update-article.dto';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepo: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
  ) {}

  async findAll(
    user: UserEntity,
    query: FindAllQuery,
  ): Promise<ArticleResponseDTO[]> {
    const queryOptions: any = {
      where: {},
    };
    if (query.offset) {
      queryOptions.offset = query.offset;
    }
    if (query.limit) {
      queryOptions.limit = query.limit;
    }
    if (query.tag) {
      queryOptions.where.tagList = Like(`%${query.tag}%`);
    }
    if (query.author) {
      queryOptions.where['author.username'] = query.author;
    }
    if (query.favorited) {
      queryOptions.where['favoritedBy.username'] = query.favorited;
    }
    const article = await this.articleRepo.find({
      ...queryOptions,
      relations: ['author'],
    });
    return article.map((art) => art.toArticle(user));
  }

  async findFeed(
    user: UserEntity,
    query: FindFeedQuery,
  ): Promise<ArticleResponseDTO[]> {
    const { followee } = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['followee'],
    });

    const findOptions = {
      ...query,
      where: followee.map((follow) => ({ author: follow.id })),
    };

    const articles = (await this.articleRepo.find(findOptions)).map((article) =>
      article.toArticle(user),
    );

    articles.push(
      ...(
        await this.articleRepo.find({
          where: { author: user },
          relations: ['author'],
        })
      ).map((article) => article.toArticle(user)),
    );

    return articles;
  }

  findById(id: number): Promise<ArticleEntity> {
    return this.articleRepo.findOne({
      where: { id },
      relations: ['comments', 'author'],
    });
  }

  async createArticle(
    user: UserEntity,
    data: CreateArticleDTO,
  ): Promise<ArticleResponseDTO> {
    const article = this.articleRepo.create(data);
    article.author = user;
    await this.upsertTags(article.tagList);
    const { id } = await article.save();
    return (await this.findById(id)).toArticle(user);
  }

  async updateArticle(
    user: UserEntity,
    data: UpdateArticleDTO,
    id: number,
  ): Promise<ArticleResponseDTO> {
    const article = await this.findById(id);
    if (article.author.id !== user.id) {
      throw new UnauthorizedException(
        'This article is not yours. So you cant update this',
      );
    }
    await this.articleRepo.update({ id }, data);
    return (await this.findById(id)).toArticle(user);
  }

  async deleteArticle(
    user: UserEntity,
    id: number,
  ): Promise<ArticleResponseDTO> {
    const article = await this.findById(id);
    if (article.author.id !== user.id) {
      throw new UnauthorizedException(
        'This article is not yours. So you cant delete this',
      );
    }
    await this.articleRepo.remove(article);
    return article.toArticle(user);
  }

  async favoriteArticle(
    user: UserEntity,
    id: number,
  ): Promise<ArticleResponseDTO> {
    const article = await this.findById(id);
    // article.favoritedBy.push(user);
    await article.save();
    return (await this.findById(id)).toArticle(user);
  }

  async unfavoriteArticle(
    user: UserEntity,
    id: number,
  ): Promise<ArticleResponseDTO> {
    const article = await this.findById(id);
    article.favoritedBy = article.favoritedBy.filter(
      (fav) => fav.id !== user.id,
    );
    await article.save();
    return (await this.findById(id)).toArticle(user);
  }

  protected ensureOwnership(articleId: number, userId: number): boolean {
    return articleId === userId;
  }

  private async upsertTags(tagList: string[]): Promise<void> {
    const foundTags = await this.tagRepo.find({
      where: tagList.map((t) => ({ tag: t })),
    });

    const newTags = tagList.filter((t) =>
      foundTags.map((t) => t.tag).includes(t),
    );

    await Promise.all(
      this.tagRepo
        .create(newTags.map((t) => ({ tag: t })))
        .map((t) => t.save()),
    );
  }
}
