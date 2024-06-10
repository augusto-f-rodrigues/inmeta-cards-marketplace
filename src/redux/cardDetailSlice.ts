import { CardI } from '@/interfaces/card.interface';
import { createSlice } from '@reduxjs/toolkit';

export interface CardDetailSliceI {
  selectedCard: CardI | null;
  isDialogOpen: boolean;
}

const initialState: CardDetailSliceI = {
  selectedCard: null,
  isDialogOpen: false,
};

const cardDetailSlice = createSlice({
  name: 'cardDetail',
  initialState,
  reducers: {
    openCardDialog(state, action) {
      state.selectedCard = action.payload;
      state.isDialogOpen = true;
    },
    closeCardDialog(state) {
      state.selectedCard = null;
      state.isDialogOpen = false;
    },
  },
});

export const { openCardDialog, closeCardDialog } = cardDetailSlice.actions;
export default cardDetailSlice.reducer;
