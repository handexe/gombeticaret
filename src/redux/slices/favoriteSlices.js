// redux/slices/favoriteSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../api/api";

// Thunk to handle favorite toggling
export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async ({ userId, itemId }, { rejectWithValue }) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        let favorites = userData.favorites || [];

        if (favorites.includes(itemId)) {
          // Remove from favorites
          favorites = favorites.filter((id) => id !== itemId);
        } else {
          // Add to favorites
          favorites.push(itemId);
        }

        await updateDoc(userRef, { favorites });
        return { userId, itemId, favorites }; // Ensure payload is returned
      } else {
        throw new Error("User does not exist");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (userId, { rejectWithValue }) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.favorites || [];
      } else {
        throw new Error("Kullanıcı Bulunamadı");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    userFavorites: [],
    loading: false,
    error: null,
  },
  reducers: {
    setUserFavorites: (state, action) => {
      state.userFavorites = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        // Ensure action.payload contains itemId and favorites
        const { itemId, favorites } = action.payload;
        state.userFavorites = favorites;
        state.loading = false;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.userFavorites = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setUserFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
