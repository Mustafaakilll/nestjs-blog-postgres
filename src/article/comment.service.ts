import { Injectable } from '@nestjs/common';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { UserEntity } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CommentResponseDTO } from './dto/comment-response.dto';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
    @InjectRepository(ArticleEntity)
    private articleRepo: Repository<ArticleEntity>,
  ) {}

  async findByArticleId(articleId: number): Promise<CommentResponseDTO[]> {
    const article = await this.commentRepo
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.author', 'user')
      .where('article.id = :id', { id: articleId })
      .getMany();

    return article;
  }

  async createComment(
    data: CreateCommentDTO,
    user: UserEntity,
    id: number,
  ): Promise<CommentResponseDTO> {
    const article = await this.articleRepo.findOne({ where: { id } });
    const comment = this.commentRepo.create(data);
    comment.article = article;
    comment.author = user;
    await comment.save();
    return comment.toJSON();
  }

  async deleteComment(
    id: number,
    user: UserEntity,
  ): Promise<CommentResponseDTO> {
    const comment = await this.commentRepo
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.author', 'user')
      .where('comment.id = :id', { id: id })
      .andWhere('comment.author.id = :authorId', { authorId: user.id })
      .getOne();

    await comment.remove();
    return comment;
  }
}
