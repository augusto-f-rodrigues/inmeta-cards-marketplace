import { CardI } from './card.interface';

export interface UserLoggedResponseI {
  id: string;
  name: string;
  email: string;
  cards: CardI[];
}
