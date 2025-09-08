import envVars from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${envVars.backendBaseUrl}/api/v1`,
    credentials: "include",
  }),
  tagTypes: ["USER", "ORDERS","SUMMARY","USERS","SINGLEUSER","ADMIN_SUMMARY", "PRODUCTS", 'PRODUCT'],
  endpoints: () => ({}),
});
