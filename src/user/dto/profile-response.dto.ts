import { UserResponseDTO } from './user-response.dto';

export class ProfileResponseDTO extends UserResponseDTO {
  following: boolean | null;
}
