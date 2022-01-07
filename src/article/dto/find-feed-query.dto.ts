import { FindAllQuery } from './find-all-query.dto';

export interface FindFeedQuery extends FindAllQuery {
  tag?: string;
  author?: string;
  favorited?: string;
}
