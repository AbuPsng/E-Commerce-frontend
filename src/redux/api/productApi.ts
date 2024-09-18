import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllCategoriesResponse,
  AllProductsResponse,
  DeleteProductsRequest,
  MessageResponse,
  newProductsRequest,
  ProductsResponse,
  SearchProductsRequest,
  SearchProductsResponse,
  UpdateProductsRequest,
} from "../../types/api-types";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/product/`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    latestProduct: builder.query<AllProductsResponse, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),
    AllProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-product?id=${id}`,
      providesTags: ["product"],
    }),
    categories: builder.query<AllCategoriesResponse, string>({
      query: (id) => `categories?id=${id}`,
      providesTags: ["product"],
    }),
    searchProducts: builder.query<
      SearchProductsResponse,
      SearchProductsRequest
    >({
      query: ({ price, page, search, sort, category }) => {
        let base = `query-prdouct?search=${search || ""}&page=${page}`;

        if (price) {
          base += `&price=${price}`;
        }

        if (sort) {
          base += `&sort=${sort}`;
        }

        if (category) {
          base += `&category=${category}`;
        }

        return base;
      },
      providesTags: ["product"],
    }),
    productDetails: builder.query<ProductsResponse, string>({
      query: (id: string) => id,
      providesTags: ["product"],
    }),
    newProduct: builder.mutation<MessageResponse, newProductsRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    updateProduct: builder.mutation<ProductsResponse, UpdateProductsRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation<ProductsResponse, DeleteProductsRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
