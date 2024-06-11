import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TradeInfoI } from '@/interfaces/trade-response.interface';

interface TradeDetailState {
  isOpen: boolean;
  trade: TradeInfoI | null;
}

const initialState: TradeDetailState = {
  isOpen: false,
  trade: null,
};

const tradeDetailSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openTradeDetails(state, action: PayloadAction<TradeInfoI>) {
      state.isOpen = true;
      state.trade = action.payload;
    },
    closeTradeDetails(state) {
      state.isOpen = false;
      state.trade = null;
    },
  },
});

export const { openTradeDetails, closeTradeDetails } = tradeDetailSlice.actions;

export default tradeDetailSlice.reducer;
