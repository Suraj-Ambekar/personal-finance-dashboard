import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "../features/transactionsSlice";
import savingsReducer from "../features/savingsSlice";

const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    savings: savingsReducer,
  },
});

export default store;
