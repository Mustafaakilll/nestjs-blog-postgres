import { UserResponseDTO } from '../../user/dto/user-response.dto';

export interface AuthResponseDTO extends UserResponseDTO {
  token: string;
}
