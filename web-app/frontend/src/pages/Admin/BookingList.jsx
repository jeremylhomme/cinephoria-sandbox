import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import LoaderFull from "../../components/LoaderFull";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

import {
  useGetBookingsQuery,
  useDeleteBookingMutation,
} from "../../redux/api/bookingApiSlice";

import { useGetUserDetailsQuery } from "../../redux/api/userApiSlice";
import { useGetMovieDetailsQuery } from "../../redux/api/movieApiSlice";
import { useGetSessionsQuery } from "../../redux/api/sessionApiSlice";

const BookingList = () => {
  const {
    data: bookings,
    isError: bookingsError,
    isLoading: bookingsLoading,
    refetch,
  } = useGetBookingsQuery();

  const [deleteBooking] = useDeleteBookingMutation();

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const [updatedBookings, setUpdatedBookings] = useState([]);

  const {
    data: user,
    isError: userError,
    isLoading: userLoading,
  } = useGetUserDetailsQuery(selectedUserId, {
    skip: !selectedUserId,
  });

  const {
    data: movie,
    isError: movieError,
    isLoading: movieLoading,
  } = useGetMovieDetailsQuery(selectedMovieId, {
    skip: !selectedMovieId,
  });

  const {
    data: sessions,
    isError: sessionsError,
    isLoading: sessionsLoading,
  } = useGetSessionsQuery(selectedSessionId, {
    skip: !selectedSessionId,
  });

  useEffect(() => {
    if (bookings?.length > 0) {
      setSelectedUserId(bookings[0].userId);
      setSelectedMovieId(bookings[0].movieId);
      setSelectedSessionId(bookings[0].sessionId);
    }
  }, [bookings]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(id).unwrap();
        refetch();
        toast.success("Booking deleted successfully!");
      } catch (err) {
        toast.error(
          `Failed to delete booking: ${err.data?.message || err.status}`
        );
      }
    }
  };

  const formatBookingDate = (dateStr) => {
    const date = new Date(dateStr);
    return [
      ("0" + date.getDate()).slice(-2),
      ("0" + (date.getMonth() + 1)).slice(-2),
      date.getFullYear(),
    ].join("/");
  };

  // Update booking status if session is deleted
  useEffect(() => {
    if (bookings && sessions) {
      const updatedBookings = bookings.map((booking) => {
        // Find the session associated with the current booking
        const session = sessions.find(
          (s) => s.id.toString() === booking.sessionId
        );
        // Determine the updated status based on the session status
        const updatedStatus =
          session?.sessionStatus === "DELETED"
            ? "no session"
            : booking.bookingStatus;

        return {
          ...booking,
          bookingStatus: updatedStatus,
        };
      });
      setUpdatedBookings(updatedBookings);
    }
  }, [bookings, sessions]);

  if (bookingsLoading) return <LoaderFull />;
  if (bookingsError) return <div>Error: {bookingsError.message}</div>;

  return (
    <>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight">
              Réservations
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="bg-white inline-block min-w-full py-2 align-middle box-border border border-solid rounded-md border-[#e5e7eb] sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-normal sm:pl-0"
                          >
                            ID
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-normal sm:pl-0"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-normal sm:pl-0"
                          >
                            Utilisateur
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-normal sm:pl-0"
                          >
                            Movie
                          </th>
                          <th
                            scope="col"
                            className="pr-3 py-3.5 text-left text-sm font-normal"
                          >
                            Session ID
                          </th>
                          <th
                            scope="col"
                            className="pr-3 py-3.5 text-left text-sm font-normal"
                          >
                            Date of Reservation
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                          >
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {updatedBookings.length > 0 ? (
                          updatedBookings.map((booking) => (
                            <tr key={booking._id}>
                              <td className="py-3.5 pl-4 pr-3 text-smsm:pl-0">
                                {booking._id}
                              </td>
                              <td
                                className={`my-3.5 py-1.5 px-2 inline-flex items-center rounded-md text-xs font-medium ${
                                  booking.bookingStatus === "no session"
                                    ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                                    : booking.bookingStatus === "confirmed"
                                    ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                                    : "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                                }`}
                              >
                                {booking.bookingStatus}
                              </td>
                              <td className="py-3.5 pl-4 pr-3 text-smsm:pl-0">
                                {user?.userFirstName ?? "Loading..."}{" "}
                                {user?.userLastName ?? ""}
                              </td>
                              <td className="py-3.5 pl-4 pr-3 text-smsm:pl-0">
                                {movie?.movieTitle ?? "Loading..."}
                              </td>
                              <td className="py-3.5 pl-4 pr-3 text-smsm:pl-0">
                                {booking?.sessionId ?? "Loading..."}
                              </td>
                              <td className="py-3.5 pl-4 pr-3 text-smsm:pl-0">
                                {formatBookingDate(booking.bookingCreatedAt)}
                              </td>

                              <td className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                <div className="flex justify-end space-x-3">
                                  <NavLink
                                    to={`/admin/bookingdetails/${booking._id}`}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    <EyeIcon className="h-6 w-6" />
                                  </NavLink>
                                  <NavLink
                                    to={`/admin/bookingupdate/${booking._id}`}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    <PencilSquareIcon className="h-6 w-6" />
                                  </NavLink>
                                  <button
                                    onClick={() => deleteHandler(booking._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <TrashIcon className="h-6 w-6" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="7"
                              className="bg-transparent py-3.5 pl-4 pr-3 text-center text-sm sm:pl-0"
                            >
                              <p>Aucune réservation pour le moment.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default BookingList;
