import { apiSlice } from "./apiSlice";
import { BASE_URL } from "../constants";

const USER_URL = `${BASE_URL}/api/users`;
const PROFILE_URL = `${BASE_URL}/api/profile`;

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (userData) => ({
        url: `${USER_URL}`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    getUsers: builder.query({
      query: () => ({
        url: USER_URL,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    getUserProfile: builder.query({
      query: (userId) => ({
        url: `${PROFILE_URL}/${userId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),

    getUserDetails: builder.query({
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

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateUserProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${PROFILE_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateUserPassword: builder.mutation({
      query: ({ id, newPassword }) => ({
        url: `${USER_URL}/${id}/update-password`,
        method: "PUT",
        body: { newPassword },
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USER_URL}/${userId}`,
        method: "DELETE",
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body: data,
      }),
      onError: (error, { dispatch }) => {
        dispatch(displayErrorNotification({ message: error.message }));
      },
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
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserProfileQuery,
  useGetUserDetailsQuery,
  useGetUserBookingsQuery,
  useUpdateUserMutation,
  useUpdateUserProfileMutation,
  useUpdateUserPasswordMutation,
  useDeleteUserMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
} = userApiSlice;
