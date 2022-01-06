import { AbstractEntity } from '../../helper/base-entity';
import { Column, Entity } from 'typeorm';

@Entity('tag')
export class TagEntity extends AbstractEntity {
  @Column()
  tag: string;
}
