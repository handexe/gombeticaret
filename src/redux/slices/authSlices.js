import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth , db } from "../../api/api";
import {  doc , setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword , signInWithEmailAndPassword ,signOut} from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, surname, number, email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Add user data to Firestore
      await setDoc(doc(db, "users", userId), {
        name,
        surname,
        number,
        email,
        favorites: [] // Initialize with empty favorites
      });

      return { uid: userId, email };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { uid: userCredential.user.uid, email: userCredential.user.email };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return {}; // Return empty object on success
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    uid: null,
    email: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Action to set the user information
    setUser: (state, action) => {
      const { uid, email } = action.payload;
      state.uid = uid;
      state.email = email;
    },
    // Action to clear the user information
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register case
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Login case
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Logout case
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.uid = null;
        state.email = null;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});



export const listenForAuthChanges = () => (dispatch) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setUser({ uid: user.uid, email: user.email }));
    } else {
      dispatch(logout());
    }
  });
};
export const { setUser, clearUser  } = authSlice.actions;
export default authSlice.reducer;