import { Product } from "@/type";
import { createSlice } from "@reduxjs/toolkit";

interface StoreState {
  productData: Product[];
  userInfo: null | string;
  orderData: [];
}

const initialState: StoreState = {
  productData: [],
  userInfo: null,
  orderData: [],
};

export const shoppingSlice = createSlice({
  name: "shopping",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingProduct = state.productData.find(
        (item: Product) => item._id === action.payload._id
      );
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else state.productData.push(action.payload);
    },
  },
});

export const { addToCart } = shoppingSlice.actions;
export default shoppingSlice.reducer;
