import { FindFeedQuery } from './find-feed-query.dto';

export interface FindAllQuery extends FindFeedQuery {
  limit?: number;
  offset?: number;
}
