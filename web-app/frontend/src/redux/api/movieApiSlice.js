import { apiSlice } from "./apiSlice";
import { MOVIE_URL } from "../constants";

export const movieApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMovie: builder.mutation({
      query: (newMovie) => ({
        url: MOVIE_URL,
        method: "POST",
        body: newMovie,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Movie"],
    }),

    updateMovie: builder.mutation({
      query: (data) => ({
        url: `${MOVIE_URL}/${data.id}`,
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Movie"],
    }),

    deleteMovie: builder.mutation({
      query: (movieId) => ({
        url: `${MOVIE_URL}/${movieId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Movie"],
    }),

    getMovies: builder.query({
      query: ({
        state = "all",
        categories = ["all"],
        cinemaId = "all",
      } = {}) => {
        const categoryQuery =
          Array.isArray(categories) &&
          categories.length > 0 &&
          categories[0] !== "all"
            ? categories.join(",")
            : "all";
        const cinemaQuery = cinemaId !== "all" ? `&cinemaId=${cinemaId}` : "";
        return {
          url: `${MOVIE_URL}?state=${state}&categories=${categoryQuery}${cinemaQuery}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["Movie"],
    }),

    getMovieDetails: builder.query({
      query: (movieId) => ({
        url: `${MOVIE_URL}/${movieId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["Movie"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useGetMoviesQuery,
  useGetMovieDetailsQuery,
} = movieApiSlice;
