import { apiSlice } from "./apiSlice";
import { UPLOAD_URL } from "../constants";

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadMovieImage: builder.mutation({
      query: ({ movieId, fileData }) => ({
        url: `${UPLOAD_URL}/movies/${movieId}/image`,
        method: "POST",
        body: fileData,
      }),
    }),

    uploadMovieVideo: builder.mutation({
      query: ({ movieId, fileData }) => ({
        url: `${UPLOAD_URL}/movies/${movieId}/video`,
        method: "POST",
        body: fileData,
      }),
    }),
  }),
});

export const { useUploadMovieImageMutation, useUploadMovieVideoMutation } =
  uploadApiSlice;
