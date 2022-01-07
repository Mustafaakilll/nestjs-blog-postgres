import { ProfileResponse } from '../../user/dto/profile-response.dto';
import { UserEntity } from '../../user/entities/user.entity';

export class CommentResponseDTO {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author: ProfileResponse | UserEntity;
}
