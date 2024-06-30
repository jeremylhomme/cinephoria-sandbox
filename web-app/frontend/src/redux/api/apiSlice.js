import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const prepareHeaders = (headers, { getState }) => {
  const token = getState().auth.token;
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }
  return headers;
};

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
  prepareHeaders,
});

console.log(import.meta.env.VITE_BASE_URL);

const baseQueryWithRejection = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    console.error("Error from server:", result.error);
    if (result.error.status === 401) {
      // Handle unauthorized error
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRejection,
  endpoints: (builder) => ({}),
  tagTypes: ["User"],
});

export default apiSlice;
