import {configureStore} from '@reduxjs/toolkit'
import productReducer from './slices/productSlices'
import authReducer from './slices/authSlices'
import cartReducer from './slices/cartSlices'
import favoriteReducer from './slices/favoriteSlices'

const store = configureStore({
    reducer: {
        items: productReducer,
        auth: authReducer,
        cart : cartReducer,
        favorites : favoriteReducer
    }
}
    
);

export default store;