import { apiSlice } from "./apiSlice";
import { ROOM_URL } from "../constants";

export const roomApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRoom: builder.mutation({
      query: (newRoom) => ({
        url: ROOM_URL,
        method: "POST",
        body: newRoom,
      }),
    }),

    updateRoom: builder.mutation({
      query: (data) => ({
        url: `${ROOM_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Room"],
    }),

    deleteRoom: builder.mutation({
      query: (roomId) => ({
        url: `${ROOM_URL}/${roomId}`,
        method: "DELETE",
      }),
    }),

    getRooms: builder.query({
      query: () => ROOM_URL,
    }),

    getRoom: builder.query({
      query: (roomId) => `${ROOM_URL}/${roomId}`,
    }),

    getRoomsForCinema: builder.query({
      query: (cinemaId) => `${ROOM_URL}/cinema/${cinemaId}`,
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useGetRoomsQuery,
  useGetRoomQuery,
  useGetRoomsForCinemaQuery,
} = roomApiSlice;
