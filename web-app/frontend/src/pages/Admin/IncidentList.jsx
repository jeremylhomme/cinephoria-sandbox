import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import LoaderFull from "../../components/LoaderFull";
import {} from "@heroicons/react/24/outline";

import {
  useGetIncidentsQuery,
  useUpdateIncidentMutation,
  useDeleteIncidentMutation,
} from "../../redux/api/incidentApiSlice";

import { useGetCinemasQuery } from "../../redux/api/cinemaApiSlice";

const IncidentList = () => {
  const { data: incidents, refetch, isLoading, error } = useGetIncidentsQuery();
  const { data: cinemas, isLoading: cinemasLoading } = useGetCinemasQuery();

  const [updateIncident] = useUpdateIncidentMutation();
  const [deleteIncident] = useDeleteIncidentMutation();

  const [selectedCinemaId, setSelectedCinemaId] = useState("");

  const [editableIncidentId, setEditableIncidentId] = useState(null);
  const [editableIncidentStatus, setEditableIncidentStatus] = useState(null);

  useEffect(() => {
    if (selectedCinemaId) {
      refetch();
    }
  }, [selectedCinemaId, refetch]);

  const toggleEdit = (_id, incidentStatus) => {
    setEditableIncidentId(_id);
    setEditableIncidentStatus(incidentStatus);
  };

  const updateHandler = async (id) => {
    try {
      const updatedIncident = {
        id: id,
        incidentStatus: editableIncidentStatus,
      };
      await updateIncident(updatedIncident).unwrap();
      toggleEdit(false);
      refetch();
      toast.success("Incident updated successfully!");
    } catch (err) {
      toast.error(
        `Failed to update the incident: ${err.data?.message || err.error}`
      );
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this incident?")) {
      try {
        await deleteIncident(id).unwrap();
        refetch();
        toast.success("Incident deleted successfully!");
      } catch (err) {
        toast.error(
          `Failed to delete incident: ${err.data?.message || err.error}`
        );
      }
    }
  };

  const formatDate = (date) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    };
    const formattedDate = new Date(date).toLocaleString("fr-FR", options);
    return formattedDate.replace(/ /, " - ");
  };

  if (isLoading || cinemasLoading) return <LoaderFull />;

  return (
    <>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Incidents
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <select
                    value={selectedCinemaId}
                    onChange={(e) => setSelectedCinemaId(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm sm:w-auto"
                  >
                    <option value="">Select a cinema</option>
                    {cinemas &&
                      cinemas.map((cinema) => (
                        <option key={cinema.id} value={cinema.id}>
                          {cinema.cinemaName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              {selectedCinemaId ? (
                incidents && incidents.length > 0 ? (
                  <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle box-border border border-solid rounded-md border-[#e5e7eb] sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                              >
                                ID
                              </th>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                              >
                                Status
                              </th>

                              <th
                                scope="col"
                                className="pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Room Number
                              </th>
                              <th
                                scope="col"
                                className="pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Reported At
                              </th>

                              <th
                                scope="col"
                                className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                              >
                                <span className="sr-only">Edit</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {incidents &&
                              incidents.map((incident) => (
                                <tr key={incident._id}>
                                  <td className="whitespace-nowrap py-5 text-sm text-gray-500">
                                    {incident._id}
                                  </td>
                                  <td className="whitespace-nowrap pr-3 py-5 text-sm text-gray-500">
                                    {editableIncidentId === incident._id ? (
                                      <div className="flex items-center">
                                        <select
                                          value={editableIncidentStatus}
                                          onChange={(e) =>
                                            setEditableIncidentStatus(
                                              e.target.value
                                            )
                                          }
                                          className="w-full p-2 border rounded-lg text-sm"
                                        >
                                          <option value="" disabled>
                                            Select a status
                                          </option>
                                          <option value="reported">
                                            Reported
                                          </option>
                                          <option value="in progress">
                                            In progress
                                          </option>
                                          <option value="resolved">
                                            Resolved
                                          </option>
                                        </select>
                                      </div>
                                    ) : (
                                      <div className="flex items-center">
                                        <div
                                          className={`py-1.5 px-2 inline-flex items-center rounded-md text-xs font-medium ${
                                            incident.incidentStatus ===
                                            "reported"
                                              ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                                              : incident.incidentStatus ===
                                                "in progress"
                                              ? "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                                              : "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                                          }`}
                                        >
                                          {incident.incidentStatus ===
                                          "reported"
                                            ? "Reported"
                                            : incident.incidentStatus ===
                                              "in progress"
                                            ? "In Progress"
                                            : incident.incidentStatus ===
                                              "resolved"
                                            ? "Resolved"
                                            : ""}
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                  <td className="whitespace-nowrap pr-3 py-5 text-sm text-gray-500">
                                    <div className="flex items-center">
                                      <div className="font-medium text-gray-900">
                                        {incident.roomNumber}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap pr-3 py-5 text-sm text-gray-500">
                                    <div className="flex items-center">
                                      <div className="font-medium text-gray-900">
                                        {formatDate(
                                          incident.incidentReportedAt
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                    {editableIncidentId === incident._id ? (
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() =>
                                            updateHandler(incident._id)
                                          }
                                          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() =>
                                            setEditableIncidentId(null)
                                          }
                                          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center space-x-2">
                                        <NavLink
                                          to={`/admin/incidentdetails/${incident._id}`}
                                          className="text-gray-500 hover:text-gray-900"
                                        >
                                          <EyeIcon className="h-5 w-5" />
                                        </NavLink>
                                        <button
                                          onClick={() =>
                                            toggleEdit(
                                              incident._id,
                                              incident.incidentStatus
                                            )
                                          }
                                          className="text-gray-500"
                                        >
                                          <PencilSquareIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            deleteHandler(incident._id)
                                          }
                                          className="text-gray-500"
                                        >
                                          <TrashIcon className="h-5 w-5" />
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8">
                    <p className="text-gray-500">
                      No incidents found for this cinema.
                    </p>
                  </div>
                )
              ) : (
                <div className="mt-8">
                  <p className="text-gray-500">
                    Please select a cinema to view rooms.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default IncidentList;
