import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk("items/fetchItems", async () => {
  const response = await axios.get("http://localhost:3001/api/items");
  return response.data;
});

export const addProduct = createAsyncThunk("items/addItem", async (newItem) => {
  const response = await axios.post("http://localhost:3001/api/items", newItem);
  return response.data;
});

export const removeProduct = createAsyncThunk(
  "items/removeItem",
  async (productId) => {
    await axios.delete(`http://localhost:3001/api/items/${productId}`);
    return productId;
  }
);
export const updateProductPrice = createAsyncThunk(
  "items/updateItem",
  async (updatedItem) => {
    const response = await axios.put(
      `http://localhost:3001/api/items/${updatedItem.id}`,
      updatedItem
    );
    return response.data;
  }
);
export const filterDiscounted = createAsyncThunk(
  "items/filterDiscounted",
  async () => {
    const response = await axios.get(
      "http://localhost:3001/api/items/discounted"
    ); // İndirimli ürünleri döndüren endpoint
    return response.data;
  }
);
// Arama sonuçlarını getiren Thunk
export const searchProducts = createAsyncThunk(
  "items/searchProducts",
  async (query) => {
    console.log(`Fetching search results for query: ${query}`); // Log the query
    const response = await axios.get(
      `http://localhost:3001/api/search?query=${query}`
    );
    return response.data;
  }
);
export const fetchItemById = createAsyncThunk(
  "items/fetchItemById",
  async (id) => {
    const response = await axios.get(`http://localhost:3001/api/items/${id}`);
    return response.data;
  }
);
const productSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    filteredProducts: [],
    newArrivals: [],
    searchResults: [],
    selectedItem: null,
    status: "idle",
    error: null,
  },
  reducers: {
    filterByCategory(state, action) {
      const category = action.payload;
      if (category === "Genel") {
        state.filteredProducts = state.items; // Tüm ürünleri göster
      } else {
        state.filteredProducts = state.items.filter(
          (item) => item.category === category
        );
      }
    },
    filterNewArrivals(state) {
      const today = new Date();
      state.newArrivals = state.items.filter((item) => {
        const itemDate = new Date(item.addeddate);
        const diffDays = Math.floor((today - itemDate) / (1000 * 60 * 60 * 24));
        return diffDays <= 30; // Son 30 gün içinde eklenen ürünler
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(fetchProduct.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   state.items.items = action.payload; // Veriyi state.items'a kaydet
      // })
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload; // Veriyi state.items'a kaydet
        // Fiyatı düşen ürünleri güncelle
        state.discountedProducts = action.payload.filter(
          (item) => item.discount > 0
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(updateProductPrice.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(filterDiscounted.fulfilled, (state, action) => {
        state.filteredProducts = action.payload;
      })
      .addCase(searchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchItemById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedItem = action.payload; // Save the selected item's details
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { filterByCategory, filterNewArrivals } = productSlice.actions;
export default productSlice.reducer;
