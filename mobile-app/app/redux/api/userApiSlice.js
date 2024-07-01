import { apiSlice } from "./apiSlice";
import { BASE_URL } from "../constants";

const USER_URL = `${BASE_URL}/api/users`;
const PROFILE_URL = `${BASE_URL}/api/users/profile`;

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: (userId) => ({
        url: `${PROFILE_URL}/${userId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),

    getUserBookings: builder.query({
      query: (userId) => ({
        url: `${USER_URL}/${userId}/bookings`,
        method: "GET",
      }),
      providesTags: ["Bookings"],
    }),

    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetUserBookingsQuery,
  useLoginMutation,
  useLogoutMutation,
} = userApiSlice;
