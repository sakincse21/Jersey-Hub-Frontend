// Need to use the React-specific entry point to import createApi
import { baseApi } from '@/redux/baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductInfo: builder.query({
      query: (productId) => ({
        url: `/product/${productId}`,
        method: "GET",
      }),
      providesTags: ["PRODUCT"]
    }),
    getProductBySlug: builder.query({
      query: (slug) => ({
        url: `/product/byslug/${slug}`,
        method: "GET",
      }),
      providesTags: ["PRODUCT"]
    }),
    getAllProducts: builder.query({
      query: (params) => ({
        url: `/product`,
        method: "GET",
        params
      }),
      providesTags: ["PRODUCT"]
    }),
    updateProduct: builder.mutation({
      query: (payload) => ({
        url: `/product/${payload.productId}`,
        method: "PATCH",
        body: payload,
        // When using FormData, the browser sets the Content-Type header automatically.
        // Do not set it manually.
      }),
      invalidatesTags: ["PRODUCT"]
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: `/product/create`,
        method: "POST",
        body: productData, // Changed from 'data' to 'body'
      }),
      invalidatesTags: ["PRODUCT"]
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCT","PRODUCTS"]
    }),
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetProductInfoQuery, 
  useLazyGetProductInfoQuery, 
  useGetAllProductsQuery, 
  useUpdateProductMutation, 
  useCreateProductMutation,
  useGetProductBySlugQuery,
  useDeleteProductMutation
} = productApi; // Changed from walletApi to productApi
