import { UserI } from './user.interface';

export interface LoginResponseI {
  token: string;
  user: UserI;
}
