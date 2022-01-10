import { ProfileResponseDTO } from '../../user/dto/profile-response.dto';
import { UserEntity } from '../../user/entities/user.entity';

export class CommentResponseDTO {
  id: number;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author: ProfileResponseDTO | UserEntity;
}
