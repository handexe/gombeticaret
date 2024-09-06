import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Sepeti getirme thunk'ı
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId) => {
  const response = await axios.get(`http://localhost:3001/cart/${userId}`);
  return response.data;
});
// Sepete ürün ekleme thunk'ı
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, name, image, price, quantity, userId }) => {
    const response = await axios.post("http://localhost:3001/cart/add", {
      productId,
      quantity,
      userId,
      name,
      image,
      price,
    });
    return response.data;
  }
); // Async thunk to increment quantity
export const incrementQuantity = createAsyncThunk(
  "cart/incrementQuantity",
  async ({ productId, userId }) => {
    const response = await axios.put("http://localhost:3001/cart/update", {
      ProductID: productId,
      Quantity: 1, // Backend will increment this value
      UserID: userId,
    });
    return response.data;
  }
);

// Async thunk to decrement quantity
export const decrementQuantity = createAsyncThunk(
  "cart/decrementQuantity",
  async ({ productId, quantity, userId }) => {
    const newQuantity = quantity - 1;
    const response = await axios.put("http://localhost:3001/cart/update", {
      ProductID: productId,
      Quantity: newQuantity,
      UserID: userId,
    });
    return response.data;
  }
);

// Async thunk to remove an item from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, userId }) => {
    const response = await axios.delete("http://localhost:3001/cart/remove", {
      data: { ProductID: productId, UserID: userId },
    });
    return response.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // Update total cart value
  },
  extraReducers: (builder) => {
    // Handle fetchCart lifecycle
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

    // Handle addToCart lifecycle
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload); // Add the new item to the cart
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    // Handle incrementQuantity lifecycle
    builder
      .addCase(incrementQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(incrementQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedItem = action.payload;
        const index = state.items.findIndex(
          (item) => item.ProductID === updatedItem.ProductID
        );
        if (index !== -1) {
          state.items[index].Quantity += 1; // Update the quantity of the item in the cart
        }
      })
      .addCase(incrementQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    // Handle decrementQuantity lifecycle
    builder
      .addCase(decrementQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(decrementQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedItem = action.payload;
        const index = state.items.findIndex(
          (item) => item.ProductID === updatedItem.ProductID
        );
        if (index !== -1) {
          state.items[index].Quantity -= 1; // Decrease the quantity of the item in the cart
          if (state.items[index].Quantity <= 0) {
            state.items.splice(index, 1); // Remove item if the quantity is 0
          }
        }
      })
      .addCase(decrementQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    // Handle removeFromCart lifecycle
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const removedItem = action.payload;
        state.items = state.items.filter(
          (item) => item.ProductID !== removedItem.ProductID
        ); // Remove the item from the cart
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
