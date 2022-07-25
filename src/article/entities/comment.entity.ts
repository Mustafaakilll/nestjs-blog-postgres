import { Column, Entity, ManyToOne } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { instanceToPlain } from 'class-transformer';
import { CommentResponseDTO } from '../../article/dto/comment-response.dto';
import { AbstractEntity } from '../../helper/base-entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('comment')
export class CommentEntity extends AbstractEntity {
  @Column()
  body: string;

  @ManyToOne(() => UserEntity, (user) => user.comments, { eager: true })
  author: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;

  toJSON() {
    return <CommentResponseDTO>instanceToPlain(this);
  }
}
