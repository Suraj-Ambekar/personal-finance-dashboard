import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

// Async thunk to fetch transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async ({ userId, filterCategory, sortByDate }, { rejectWithValue }) => {
    try {
      let transactionsQuery = query(
        collection(db, "transactions"),
        where("userId", "==", userId)
      );

      if (filterCategory) {
        transactionsQuery = query(
          transactionsQuery,
          where("category", "==", filterCategory)
        );
      }

      if (sortByDate) {
        transactionsQuery = query(transactionsQuery, orderBy("date", "desc"));
      }

      const querySnapshot = await getDocs(transactionsQuery);
      console.log(
        "Fetched Transactions:",
        querySnapshot.docs.map((doc) => doc.data())
      );

      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add a transaction
export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transactionData, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(
        collection(db, "transactions"),
        transactionData
      );
      return { id: docRef.id, ...transactionData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete a transaction
export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (transactionId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "transactions", transactionId));
      return transactionId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update a transaction
export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, "transactions", id), updatedData);
      return { id, updatedData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = {
            ...state.transactions[index],
            ...action.payload.updatedData,
          };
        }
      });
  },
});

export default transactionsSlice.reducer;
