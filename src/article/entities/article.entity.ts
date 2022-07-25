import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationCount,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { instanceToPlain } from 'class-transformer';
import { ArticleResponseDTO } from '../../article/dto/article-response.dto';
import { AbstractEntity } from '../../helper/base-entity';
import { UserEntity } from '../../user/entities/user.entity';

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

  @Column()
  coverImage: string;

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
