import { IsArray, IsString } from 'class-validator';

export class CreateArticleDTO {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsArray()
  tagList: string[];

  @IsString()
  coverImage: string;
}
