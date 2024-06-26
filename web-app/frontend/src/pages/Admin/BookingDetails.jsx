import React from "react";
import { NavLink, useParams } from "react-router-dom";
import LoaderFull from "../../components/LoaderFull";
import { useGetBookingDetailsQuery } from "../../redux/api/bookingApiSlice";

const BookingDetails = () => {
  const { id } = useParams();

  const { data: booking, isFetching, isError } = useGetBookingDetailsQuery(id);

  if (isFetching) return <LoaderFull />;
  if (isError) return <p>Error fetching booking details.</p>;

  return (
    <>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {booking
                ? `Booking Details for ${booking.movie.movieTitle}`
                : "Booking Details"}
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <p className="mt-2 text-sm text-gray-700">
                    Detailed information about the booking.
                  </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <NavLink
                    to="/user/orders"
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
                          <div>
                            <div className="px-4 sm:px-0">
                              <h3 className="text-base font-semibold leading-7 text-gray-900">
                                Booking Information
                              </h3>
                              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                                Details of the booking.
                              </p>
                            </div>
                            <div className="mt-6 border-t border-gray-100">
                              <dl className="divide-y divide-gray-100">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    Movie Title
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {booking.movie.movieTitle}
                                  </dd>
                                </div>

                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    Session Date & Time
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {booking.session.timeRanges.map(
                                      (timeRange) => (
                                        <span
                                          key={timeRange.timeRangeStartTime}
                                        >
                                          {new Date(
                                            timeRange.timeRangeStartTime
                                          ).toLocaleDateString()}{" "}
                                          at{" "}
                                          {new Date(
                                            timeRange.timeRangeStartTime
                                          ).toLocaleTimeString()}{" "}
                                          -{" "}
                                          {new Date(
                                            timeRange.timeRangeEndTime
                                          ).toLocaleTimeString()}
                                        </span>
                                      )
                                    )}
                                  </dd>
                                </div>

                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    Cinema Name
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {booking.session.room.cinema.cinemaName}
                                  </dd>
                                </div>

                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    Seats Booked
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {booking.seatsBooked
                                      .map((seat) => seat.seatNumber)
                                      .join(", ")}
                                  </dd>
                                </div>

                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    Booking Price
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    ${booking.bookingPrice.toFixed(2)}
                                  </dd>
                                </div>

                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    Booking Status
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {booking.bookingStatus}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          </div>
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

export default BookingDetails;
