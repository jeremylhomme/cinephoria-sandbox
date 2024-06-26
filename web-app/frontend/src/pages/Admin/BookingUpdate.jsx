import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PhotoIcon } from "@heroicons/react/24/outline";
import LoaderFull from "../../components/LoaderFull";

import BookingSeatsMap from "../../components/BookingSeatsMap";

import { useGetMovieDetailsQuery } from "../../redux/api/movieApiSlice";
import { useGetSessionDetailsQuery } from "../../redux/api/sessionApiSlice";
import { useGetUserDetailsQuery } from "../../redux/api/userApiSlice";

import {
  useGetBookingDetailsQuery,
  useCreateOrUpdateBookingMutation,
} from "../../redux/api/bookingApiSlice";

const BookingUpdate = () => {
  const { id: bookingId } = useParams();

  const {
    data: booking,
    isError: bookingError,
    isLoading: bookingLoading,
  } = useGetBookingDetailsQuery(bookingId);

  const [updateBooking, { isLoading: isUpdating }] =
    useCreateOrUpdateBookingMutation();

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [bookingStatus, setBookingStatus] = useState("");

  // Fetch user details whenever selectedUserId changes
  const {
    data: user,
    isError: userError,
    isLoading: userLoading,
  } = useGetUserDetailsQuery(selectedUserId, {
    skip: !selectedUserId, // Skip fetching if no user is selected
  });

  // Fetch movie details whenever selectedMovieId changes
  const {
    data: movie,
    isError: movieError,
    isLoading: movieLoading,
  } = useGetMovieDetailsQuery(selectedMovieId, {
    skip: !selectedMovieId, // Skip fetching if no movie is selected
  });

  // Fetch session details whenever selectedSessionId changes
  const {
    data: session,
    isError: sessionError,
    isLoading: sessionLoading,
  } = useGetSessionDetailsQuery(selectedSessionId, {
    skip: !selectedSessionId, // Skip fetching if no session is selected
  });

  useEffect(() => {
    if (booking) {
      setSelectedUserId(booking.userId);
      setSelectedMovieId(booking.movieId);
      setSelectedSessionId(booking.sessionId);
      setBookingStatus(booking.bookingStatus);
      if (booking.seatsBooked) {
        const seatNumbers = booking.seatsBooked.map((seat) => seat.seatNumber);
        setSelectedSeats(seatNumbers);
      }
    }
  }, [booking]);

  const handleUpdate = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }

    try {
      // Construct the booking payload including the updated status
      const updatedBooking = {
        bookingId,
        userId: selectedUserId,
        movieId: selectedMovieId,
        sessionId: selectedSessionId,
        seatsBooked: selectedSeats.map((seatId) => ({ seatNumber: seatId })),
        bookingStatus: bookingStatus,
      };

      // Trigger the updateBooking mutation
      const result = await updateBooking({
        id: bookingId,
        ...updatedBooking,
      }).unwrap();

      // Handle success
      toast.success("Booking updated successfully.");
      // Optional: Navigate to a different page or reset the form
    } catch (err) {
      // Handle error
      toast.error(`Update failed: ${err.message}`);
    }
  };

  if (bookingLoading || userLoading || movieLoading || sessionLoading) {
    return <LoaderFull />;
  }

  return (
    <>
      <div>
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Update a Booking
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <p className="mt-2 text-sm text-gray-700">
                    A list of all the bookings made by users.
                  </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 flex ">
                  <NavLink
                    to="/admin/bookinglist"
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Go back
                  </NavLink>
                </div>
              </div>
              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="min-w-full divide-y divide-gray-300">
                      <form>
                        <div className="space-y-12">
                          <div className="border-b border-gray-900/10">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                              Profile
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                              This information will be displayed publicly so be
                              careful what you share.
                            </p>

                            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                              <div className="sm:col-span-3">
                                <div className="mt-6 border-t border-gray-100">
                                  <dl className="divide-y divide-gray-100">
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                      <dt className="text-sm font-medium leading-6 text-gray-900">
                                        Session ID
                                      </dt>
                                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {session?.id ?? "Loading..."}
                                      </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                      <dt className="text-sm font-medium leading-6 text-gray-900">
                                        User
                                      </dt>
                                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {user?.userFirstName ?? "Loading..."}{" "}
                                        {user?.userLastName ?? ""}
                                      </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                      <dt className="text-sm font-medium leading-6 text-gray-900">
                                        Movie
                                      </dt>
                                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {movie?.movieTitle ?? "Loading..."}
                                      </dd>
                                    </div>

                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                      <dt className="text-sm font-medium leading-6 text-gray-900">
                                        Status
                                      </dt>
                                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        <select
                                          value={bookingStatus}
                                          onChange={(e) =>
                                            setBookingStatus(e.target.value)
                                          }
                                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                          <option value="pending">
                                            Pending
                                          </option>
                                          <option value="confirmed">
                                            Confirmed
                                          </option>
                                          <option value="cancelled">
                                            Cancelled
                                          </option>
                                        </select>
                                      </dd>
                                    </div>
                                    <div className="px-4 pt-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                      <dt className="text-sm font-medium leading-6 text-gray-900">
                                        Seats Booked
                                      </dt>
                                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center">
                                        <BookingSeatsMap
                                          initialSeats={
                                            selectedSeats ? selectedSeats : []
                                          }
                                          onSeatSelect={setSelectedSeats}
                                        />
                                      </dd>
                                    </div>
                                  </dl>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-x-6">
                          <button
                            type="button"
                            className="text-sm font-semibold leading-6 text-gray-900"
                            /* onClick={resetForm} */
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            onClick={handleUpdate}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
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

export default BookingUpdate;
