import { ProfileResponseDTO } from '../../user/dto/profile-response.dto';

export type ArticleResponseDTO = {
  title: string;
  body: string;
  tagList: string[];
  author: ProfileResponseDTO;
  createdAt: Date | null;
  updatedAt: Date | null;
  favorited: boolean;
  favoriteCount: number;
};
