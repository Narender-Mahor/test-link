import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const GetProducts = createAsyncThunk("GetProductsData", async () => {
  try {
    const response = await axios.get("https://dummyjson.com/products");
    return response;
  } catch (error) {
    console.log("error", error);
  }
});

export const ProductsGetData = createSlice({
  name: "ProductsGet",
  initialState: {
    data: null,
  },
  loading: false,
  error: null,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })

      .addCase(GetProducts.rejected, (state, action) => {
        state.loading = true;
        state.data = action.payload;
      });
  },
});

export default ProductsGetData;
