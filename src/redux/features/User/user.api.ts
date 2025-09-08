// Need to use the React-specific entry point to import createApi
import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchUser: builder.query({
      query: (phoneNo) => ({
        url: `/user/search/${phoneNo}`,
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({
        url: `/user/${payload.userId}`,
        method: "PATCH",
        body: payload.body,
      }),
    }),
    updatePassword: builder.mutation({
      query: (body) => ({
        url: `/user/update-password`,
        method: "PATCH",
        body,
      }),
    }),
    updateUser: builder.mutation({
      query: (payload) => ({
        url: `/user/admin/${payload.userId}`,
        method: "PATCH",
        body:payload,
      }),
      invalidatesTags: ["SINGLEUSER","USERS","ADMIN_SUMMARY"],
    }),
    userInfo: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
        // body: userInfo,
      }),
      providesTags: ["USER"],
    }),
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/user/all-users",
        method: "GET",
        params,
      }),
      providesTags: ["USERS"],
    }),
    getSingleUser: builder.query({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["SINGLEUSER"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useSearchUserQuery,
  useLazySearchUserQuery,
  useUserInfoQuery,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useGetSingleUserQuery,
  useLazyGetSingleUserQuery
} = userApi;
