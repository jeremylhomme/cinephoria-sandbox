import { apiSlice } from "./apiSlice";
import { BASE_URL } from "../constants";

const UPLOAD_URL = `${BASE_URL}/api/uploads`;

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
