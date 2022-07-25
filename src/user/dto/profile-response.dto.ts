import { UserResponseDTO } from './user-response.dto';

export type ProfileResponseDTO = UserResponseDTO & {
  following: boolean | null;
};
