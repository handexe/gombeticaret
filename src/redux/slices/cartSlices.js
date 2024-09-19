import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../api/api";

// Sepeti getirme thunk'ı
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId) => {
  const cartRef = doc(db, "carts", userId);
  const docSnap = await getDoc(cartRef);
  if (docSnap.exists()) {
    return docSnap.data().items; // Sepet öğelerini döndür
  } else {
    return []; // Eğer belge yoksa boş döndür
  }
});

// Sepete ürün ekleme thunk'ı
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, userId, name, image, price }) => {
    try {
      // Reference to the cart document for the user
      const cartRef = doc(db, 'carts', userId);
      const newItem = { productId, quantity, name, image, price };

      // Fetch the current document data
      const docSnap = await getDoc(cartRef);

      if (docSnap.exists()) {
        let existingItems = docSnap.data().items || []; // Ensure existingItems is always an array
        console.log('Existing items:', existingItems);

        // Check if the item already exists in the cart
        const itemIndex = existingItems.findIndex(item => item.productId === productId);
        console.log('Item index:', itemIndex);

        if (itemIndex > -1) {
          // If the item exists, update its quantity
          existingItems[itemIndex].quantity += quantity;
        } else {
          // If the item does not exist, add it to the array
          existingItems.push(newItem);
        }

        // Update the document with the new items array
        await updateDoc(cartRef, { items: existingItems });
      } else {
        // If the document does not exist, create it with the new item
        await setDoc(cartRef, { items: [newItem] });
      }

      return newItem; // Return the newly added item
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error; // Rethrow the error to be handled by the thunk
    }
  }
);


// Miktarı arttırma thunk'ı
export const incrementQuantity = createAsyncThunk(
  "cart/incrementQuantity",
  async ({ productId, userId }) => {
    const cartRef = doc(db, "carts", userId);
    const docSnap = await getDoc(cartRef);
    if (docSnap.exists()) {
      const items = docSnap.data().items;
      const updatedItems = items.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      await updateDoc(cartRef, { items: updatedItems });
      return { productId, quantity: 1 };
    }
  }
);

// Miktarı azaltma thunk'ı
export const decrementQuantity = createAsyncThunk(
  "cart/decrementQuantity",
  async ({ productId, userId }) => {
    const cartRef = doc(db, "carts", userId);
    const docSnap = await getDoc(cartRef);
    if (docSnap.exists()) {
      const items = docSnap.data().items;
      const updatedItems = items
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
      await updateDoc(cartRef, { items: updatedItems });
      return { productId, quantity: -1 };
    }
  }
);

// Sepetten ürün çıkarma thunk'ı
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, userId }) => {
    const cartRef = doc(db, "carts", userId);
    const docSnap = await getDoc(cartRef);
    if (docSnap.exists()) {
      const updatedItems = docSnap
        .data()
        .items.filter((item) => item.productId !== productId);
      await updateDoc(cartRef, { items: updatedItems });
      return { productId };
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(incrementQuantity.fulfilled, (state, action) => {
        const { productId } = action.payload;
        const item = state.items.find((item) => item.productId === productId);
        if (item) {
          item.quantity += 1;
        }
      })
      .addCase(decrementQuantity.fulfilled, (state, action) => {
        const { productId } = action.payload;
        const item = state.items.find((item) => item.productId === productId);
        if (item) {
          item.quantity -= 1;
          if (item.quantity <= 0) {
            state.items = state.items.filter((item) => item.productId !== productId);
          }
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.productId !== action.payload.productId);
      });
  },
});

export default cartSlice.reducer;
