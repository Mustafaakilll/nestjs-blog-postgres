import { AbstractEntity } from '../../helper/base-entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationCount,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { instanceToPlain } from 'class-transformer';
import { ArticleResponseDTO } from '../dto/article-response.dto';

@Entity('article')
export class ArticleEntity extends AbstractEntity {
  @Column()
  title: string;

  @Column()
  body: string;

  @Column('simple-array')
  tagList: string[];

  @ManyToOne(() => UserEntity, (user) => user.articles)
  author: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.favorites, { eager: true })
  @JoinTable()
  favoritedBy: UserEntity[];

  @RelationCount((article: ArticleEntity) => article.favoritedBy)
  favoriteCount: number;

  @OneToMany(() => CommentEntity, (comment) => comment.article)
  comments: CommentEntity[];

  toJSON(): ArticleResponseDTO {
    return <ArticleResponseDTO>instanceToPlain(this);
  }

  toArticle(user?: UserEntity): ArticleResponseDTO {
    let favorited = null;
    if (user) {
      favorited = this.favoritedBy.map((fav) => fav.id).includes(user.id);
    }
    const article: any = this.toJSON();
    return { ...article, favorited };
  }
}
