import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../helper/base-entity';
import { ArticleEntity } from '../../article/entities/article.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { instanceToPlain } from 'class-transformer';
import { CommentResponseDTO } from '../dto/comment-response.dto';

@Entity('comment')
export class CommentEntity extends AbstractEntity {
  @Column()
  body: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  author: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;

  toJSON() {
    return <CommentResponseDTO>instanceToPlain(this);
  }
}
