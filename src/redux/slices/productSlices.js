import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  query,
  where,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../api/api";

export const updateProductsWithImages = (products) => ({
  type: "products/updateImages",
  payload: products,
});

export const fetchProducts = createAsyncThunk("items/fetchItems", async () => {
  const querySnapshot = await getDocs(collection(db, `items`));
  const items = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return items; // Ürünleri döndür
});
export const addProduct = createAsyncThunk("items/addItem", async (newItem) => {
  const categoryName = newItem.category;

  // Tüm itemleri firestore dan al
     // const querySnapshot = await getDocs(collection(db, "items"));

  // Filter items by the category to determine how many items are in the category
     // const categoryItems = querySnapshot.docs.filter(
     //   (doc) => doc.data().category === categoryName
     // );

  // İtemlere yeni idler ata
  const newId = `${categoryName}_${newItem.name}`; // Örnek : Hırdavat_Koli Bandı

  // İtemleri id adları ile referans ver 
  const docRef = doc(db, "items", newId);

  // yeni idleri ile itemleri firestore a yükle
  await setDoc(docRef, {
    id: newId,
    ...newItem, 
  });

  return { id: newId, ...newItem }; // İtemleri yeni idleri ile beraber döndür
});

export const removeProduct = createAsyncThunk(
  "items/removeItem",
  async (productId) => {
    const docRef = doc(db, "items", productId);
    await deleteDoc(docRef);
    return productId;
  }
);
export const updateProductPrice = createAsyncThunk(
  "items/updateItem",
  async (updatedItem) => {
    const docRef = doc(db, "items", updatedItem.id);

    // Fetch the current document
    const docSnap = await getDocs(docRef);
    if (!docSnap.exists()) {
      throw new Error("Product not found");
    }

    const currentData = docSnap.data();
    const currentPrice = currentData.price;

    await updateDoc(docRef, { ...updatedItem, oldprice: currentPrice });
    return updatedItem;
  }
);
export const filterDiscounted = createAsyncThunk(
  "items/filterDiscounted",
  async () => {
    const q = query(collection(db, "items"), where("oldprice", ">", "price"));

    const querySnapshot = await getDocs(q);
    const discountedItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return discountedItems;
  }
);
// Arama sonuçlarını getiren Thunk
export const searchProducts = createAsyncThunk(
  'products/search',
  async (searchText) => {
    try {
      const productRef = collection(db, 'items');
      const q = query(
        productRef,
        where('name', '>=', searchText),
        where('name', '<=', searchText + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
);


export const fetchItemById = createAsyncThunk(
  "items/fetchItemById",
  async (id) => {
    const docRef = doc(db, "items", id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      throw new Error("Item not found");
    }
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
        const itemDate = new Date(item.addedDate);
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
      // ekleme
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // silme
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      // güncelleme
      .addCase(updateProductPrice.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // filtreleme
      .addCase(filterDiscounted.fulfilled, (state, action) => {
        state.filteredProducts = action.payload;
      })
      // arama yapma
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

      //İtem getirme
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
