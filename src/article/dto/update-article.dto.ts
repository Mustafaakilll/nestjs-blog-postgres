import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateArticleDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  body: string;

  @IsArray()
  @IsOptional()
  tagList: string[];
}
