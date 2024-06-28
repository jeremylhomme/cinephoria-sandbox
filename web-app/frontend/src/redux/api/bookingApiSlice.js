import { apiSlice } from "./apiSlice";
import { BASE_URL } from "../constants";

const BOOKING_URL = `${BASE_URL}/api/bookings`;

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create or update a booking
    createOrUpdateBooking: builder.mutation({
      query: (bookingData) => ({
        url: `${BOOKING_URL}`,
        method: bookingData.bookingId ? "PUT" : "POST",
        body: bookingData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // Delete a booking
    deleteBooking: builder.mutation({
      query: (bookingId) => ({
        url: `${BOOKING_URL}/${bookingId}`,
        method: "DELETE",
      }),
    }),

    // Soft delete a booking
    softDeleteBooking: builder.mutation({
      query: (bookingId) => ({
        url: `${BOOKING_URL}/soft-delete/${bookingId}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // Get all bookings
    getBookings: builder.query({
      query: () => BOOKING_URL,
    }),

    // Get booking details by ID
    getBookingDetails: builder.query({
      query: (id) => ({
        url: `${BOOKING_URL}/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: 5,
    }),

    // Get booking counts for the last 7 days
    getBookingsCountLast7Days: builder.query({
      query: () => `${BOOKING_URL}/bookings-count-last-7-days`,
      providesTags: ["Bookings"],
    }),
  }),
});

export const {
  useCreateOrUpdateBookingMutation,
  useDeleteBookingMutation,
  useSoftDeleteBookingMutation,
  useGetBookingsQuery,
  useGetBookingDetailsQuery,
  useGetBookingsCountLast7DaysQuery,
} = bookingApiSlice;
