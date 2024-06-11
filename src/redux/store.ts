import { configureStore } from '@reduxjs/toolkit';
import alertReducer from './alertSlice';
import cardDetailReducer from './cardDetailSlice';
import tradeDetailReducer from './tradeDetailSlice';

export default configureStore({
  reducer: {
    alert: alertReducer,
    cardDetail: cardDetailReducer,
    tradeDetail: tradeDetailReducer,
  },
});
