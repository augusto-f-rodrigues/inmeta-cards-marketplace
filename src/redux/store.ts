import { configureStore } from '@reduxjs/toolkit';
import alertReducer from './alertSlice';
import cardDetailReducer from './cardDetailSlice';

export default configureStore({
  reducer: {
    alert: alertReducer,
    cardDetail: cardDetailReducer,
  },
});
