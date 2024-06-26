import { FILM_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const filmApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFilms: builder.query({
      query: ({ keyword }) => ({
        url: `${FILM_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Films"],
    }),

    getFilmById: builder.query({
      query: (filmId) => `${FILM_URL}/${filmId}`,
      providesTags: (result, error, filmId) => [{ type: "Film", id: filmId }],
    }),

    fetchAllFilms: builder.query({
      query: () => `${FILM_URL}/allfilms`,
    }),

    getFilmDetails: builder.query({
      query: (filmId) => ({
        url: `${FILM_URL}/${filmId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    createFilm: builder.mutation({
      query: (filmData) => ({
        url: `${FILM_URL}`,
        method: "POST",
        body: filmData,
      }),
      invalidatesTags: ["Film"],
    }),

    updateFilm: builder.mutation({
      query: ({ filmId, formData }) => ({
        url: `${FILM_URL}/${filmId}`,
        method: "PUT",
        body: formData,
      }),
    }),

    uploadFilmImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    deleteFilm: builder.mutation({
      query: (filmId) => ({
        url: `${FILM_URL}/${filmId}`,
        method: "DELETE",
      }),
      providesTags: ["Film"],
    }),

    getFilteredFilms: builder.query({
      query: ({ checked, radio }) => ({
        url: `${FILM_URL}/filtered-films`,
        method: "POST",
        body: { checked, radio },
      }),
    }),
  }),
});

export const {
  useGetFilmsQuery,
  useGetFilmByIdQuery,
  useFetchAllFilmsQuery,
  useGetFilmDetailsQuery,
  useCreateFilmMutation,
  useUpdateFilmMutation,
  useUploadFilmImageMutation,
  useDeleteFilmMutation,
  useGetFilteredFilmsQuery,
} = filmApiSlice;
