// Need to use the React-specific entry point to import createApi
import { baseApi } from "@/redux/baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allOrders: builder.query({
      query: (params) => ({
        url: "/order",
        method: "GET",
        params
      }),
      providesTags: ["ORDERS"]
  }),
    summary: builder.query({
      query: () => ({
        url: "/order/summary",
        method: "GET",
        // body: userInfo,
      }),
      providesTags: ["SUMMARY"]
  }),
    cancel: builder.mutation({
      query: (orderId) => ({
        url: `/order/cancel/${orderId}`,
        method: "PATCH",
        body: {
          status: "CANCELLED"
        },
      }),
      invalidatesTags: ['ORDERS']
  }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/order/create',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['PRODUCT'], // Invalidate products to update stock
  }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useAllOrdersQuery,
  useSummaryQuery,
  useCancelMutation,
  useCreateOrderMutation,
} = orderApi;
