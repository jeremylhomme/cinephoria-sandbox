import { apiSlice } from "./apiSlice";
import { BASE_URL } from "../constants";

const INCIDENT_URL = `${BASE_URL}/api/incidents`;

export const incidentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createIncident: builder.mutation({
      query: (newIncident) => ({
        url: INCIDENT_URL,
        method: "POST",
        body: newIncident,
      }),
    }),

    updateIncident: builder.mutation({
      query: (data) => ({
        url: `${INCIDENT_URL}/${data.id}`,
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Incident"],
    }),

    deleteIncident: builder.mutation({
      query: (incidentId) => ({
        url: `${INCIDENT_URL}/${incidentId}`,
        method: "DELETE",
      }),
    }),

    getIncidents: builder.query({
      query: () => INCIDENT_URL,
      method: "GET",
    }),

    getIncident: builder.query({
      query: (id) => ({
        url: `${INCIDENT_URL}/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateIncidentMutation,
  useUpdateIncidentMutation,
  useDeleteIncidentMutation,
  useGetIncidentsQuery,
  useGetIncidentQuery,
} = incidentApiSlice;
