import { configureStore } from "@reduxjs/toolkit";
import ProductsGetData from "./slices/GetProducts";

export const store = configureStore({
  reducer: {
    ProductData: ProductsGetData.reducer,
  },
});
