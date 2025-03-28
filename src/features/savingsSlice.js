import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Async Thunks
export const fetchSavingGoals = createAsyncThunk(
  "savings/fetchSavingGoals",
  async ({ userId }) => {
    const q = query(
      collection(db, "savingsGoals"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const addSavingGoal = createAsyncThunk(
  "savings/addSavingGoal",
  async ({ userId, name, amount, saved }) => {
    const docRef = await addDoc(collection(db, "savingsGoals"), {
      userId,
      name,
      amount,
      saved,
    });
    return { id: docRef.id, userId, name, amount, saved };
  }
);

// Slice
const savingsSlice = createSlice({
  name: "savings",
  initialState: {
    savingsGoals: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavingGoals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSavingGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.savingsGoals = action.payload;
      })
      .addCase(fetchSavingGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addSavingGoal.fulfilled, (state, action) => {
        state.savingsGoals.push(action.payload);
      });
  },
});

export default savingsSlice.reducer;
