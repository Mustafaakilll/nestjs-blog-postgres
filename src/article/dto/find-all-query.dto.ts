import { FindFeedQuery } from './find-feed-query.dto';

export type FindAllQuery = FindFeedQuery & {
  limit?: number;
  offset?: number;
};
