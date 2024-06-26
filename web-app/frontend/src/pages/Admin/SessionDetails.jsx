import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoaderFull from "../../components/LoaderFull";
import { useGetSessionDetailsQuery } from "../../redux/api/sessionApiSlice";
import { useGetBookingsQuery } from "../../redux/api/bookingApiSlice";

const SessionDetails = () => {
  const { id } = useParams();

  const {
    data: sessionData,
    isLoading: sessionLoading,
    error: sessionError,
  } = useGetSessionDetailsQuery(id);

  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useGetBookingsQuery(undefined, {
    skip: !sessionData,
  });

  useEffect(() => {
    if (sessionError) {
      toast.error("An error occurred while fetching session details.");
      console.error("Error fetching session details:", sessionError);
    }
    if (bookingsError) {
      toast.error("An error occurred while fetching bookings.");
      console.error("Error fetching bookings:", bookingsError);
    }
  }, [sessionError, bookingsError]);

  if (sessionLoading || bookingsLoading) return <LoaderFull />;

  const session = sessionData?.session || {};
  const bookings = bookingsData || [];

  const formatTimeRange = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    return `${startTime.toUTCString().slice(17, 22)} to ${endTime
      .toUTCString()
      .slice(17, 22)}`;
  };

  const groupByDate = (ranges) => {
    const grouped = ranges.reduce((acc, range) => {
      const date = new Date(range.timeRangeStartTime)
        .toISOString()
        .slice(0, 10);
      if (!acc[date]) acc[date] = [];
      acc[date].push(range);
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, ranges]) => ({ date, ranges }));
  };

  const fullCinemaAddress = session?.cinema
    ? `${session.cinema.cinemaAddress}, ${session.cinema.cinemaPostalCode} ${session.cinema.cinemaCity}, ${session.cinema.cinemaCountry}`
    : "No address available.";

  return (
    <>
      <div className="py-10">
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                <div>
                  <div className="px-4 sm:px-0">
                    <div className="sm:flex sm:items-center justify-between">
                      <h1 className="text-2xl font-bold leading-tight tracking-tight">
                        {session?.movie
                          ? `${session.movie.movieTitle} - Session n°${session.id}`
                          : "Session Details"}
                      </h1>
                      <div className="mt-4 sm:mt-0 sm:flex-none">
                        <NavLink
                          to="/admin/sessionlist"
                          className="text-center pb-2 border-b-2 text-sm font-semibold shadow-sm hover:text-gray-400 hover:border-gray-400"
                        >
                          Go back
                        </NavLink>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-100">
                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <div className="overflow-hidden shadow rounded-lg">
                        <dt className="text-sm font-bold truncate p-4">
                          Movie Description
                        </dt>
                        <dd className="text-sm p-4">
                          <div className="font-bold">
                            {session?.movie?.movieTitle}
                          </div>
                          <div>{session?.movie?.movieDescription}</div>
                        </dd>
                      </div>
                      <div className="overflow-hidden shadow rounded-lg">
                        <dt className="text-sm font-bold truncate p-4">
                          Cinema Details
                        </dt>
                        <dd className="text-sm p-4">
                          <div className="font-bold">
                            {session?.cinema?.cinemaName}
                          </div>
                          <div>{fullCinemaAddress}</div>
                        </dd>
                      </div>
                      <div className="overflow-hidden shadow rounded-lg">
                        <dt className="text-sm font-bold truncate p-4">
                          Room Details
                        </dt>
                        <dd className="text-sm p-4">
                          <div>{`Room number: ${session?.room?.roomNumber}`}</div>
                          <div>{`Quality: ${session?.room?.roomQuality}`}</div>
                          <div>{`Capacity: ${session?.room?.roomCapacity}`}</div>
                        </dd>
                      </div>
                      <div className="overflow-hidden shadow rounded-lg">
                        <dt className="text-sm font-bold truncate p-4">
                          Bookings
                        </dt>
                        <dd className="text-sm p-4">
                          {bookings.filter(
                            (booking) =>
                              booking.sessionId === session.id.toString()
                          ).length === 0 ? (
                            <div>No bookings yet for this session.</div>
                          ) : (
                            bookings
                              .filter(
                                (booking) =>
                                  booking.sessionId === session.id.toString()
                              )
                              .map((booking) => (
                                <div key={booking._id}>
                                  <div className="font-bold">
                                    {`Booking ID: ${booking._id}`}
                                  </div>
                                  <div>{`User: ${booking.user.userFirstName} ${booking.user.userLastName}`}</div>
                                  <div>{`Email: ${booking.user.userEmail}`}</div>
                                  <div>{`Seats: ${booking.seatsBooked
                                    .map((seat) => seat.seatNumber)
                                    .join(", ")}`}</div>
                                  <div>{`Status: ${booking.bookingStatus}`}</div>
                                  <div>{`Total Price: ${booking.bookingPrice}`}</div>
                                </div>
                              ))
                          )}
                        </dd>
                      </div>
                      <div className="overflow-hidden shadow rounded-lg">
                        <dt className="text-sm font-bold truncate p-4">
                          Time Ranges
                        </dt>
                        <dd className="text-sm p-4">
                          {session?.timeRanges?.map((range, idx) => (
                            <div key={idx}>
                              {formatTimeRange(
                                range.timeRangeStartTime,
                                range.timeRangeEndTime
                              )}
                            </div>
                          ))}
                        </dd>
                      </div>
                    </dl>
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

export default SessionDetails;
