import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../helper/base-entity';
import { ArticleEntity } from '../../article/entities/article.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { instanceToPlain } from 'class-transformer';

@Entity('comment')
export class CommentEntity extends AbstractEntity {
  @Column()
  body: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  author: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;

  toJSON() {
    /// TODO: LOOK HERE FOR GENERIC TYPE
    return instanceToPlain(this);
  }
}
