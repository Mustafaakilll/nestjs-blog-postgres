import { UserResponseDTO } from '../../user/dto/user-response.dto';

export type AuthResponseDTO = { user: UserResponseDTO; token: string };
