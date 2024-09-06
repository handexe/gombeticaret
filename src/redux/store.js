import {configureStore} from '@reduxjs/toolkit'
import productReducer from './slices/productSlices'
import authReducer from './slices/authSlices.js'
import cartReducer from './slices/cartSlices'
const store = configureStore({
    reducer: {
        items: productReducer,
        auth: authReducer,
        cart : cartReducer,
    }
}
    
);

export default store;