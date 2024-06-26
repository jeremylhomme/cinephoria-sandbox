import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import LoaderFull from "../../components/LoaderFull";
import {
  useGetSessionDetailsQuery,
  useUpdateSessionMutation,
  useGetAvailableTimeRangesQuery,
  useGetBookedTimeRangesQuery,
  useCreateAvailableTimeRangesMutation, // Add this
} from "../../redux/api/sessionApiSlice";
import { useGetMoviesQuery } from "../../redux/api/movieApiSlice";
import { useGetCinemasQuery } from "../../redux/api/cinemaApiSlice";
import { useGetRoomsQuery } from "../../redux/api/roomApiSlice";

const SessionUpdate = () => {
  const { id: rawId } = useParams();
  const id = parseInt(rawId, 10);

  const urlParams = new URLSearchParams(window.location.search);
  const cinemaIdFromUrl = urlParams.get("cinemaId");
  const movieIdFromUrl = urlParams.get("movieId");

  const {
    data: session,
    isLoading: isLoadingSessionDetails,
    isError: isErrorSessionDetails,
  } = useGetSessionDetailsQuery({
    sessionId: id,
    cinemaId: cinemaIdFromUrl || "",
    movieId: movieIdFromUrl || "",
  });

  const { data: movies, isLoading: isLoadingMovies } = useGetMoviesQuery();
  const { data: cinemas, isLoading: isLoadingCinemas } = useGetCinemasQuery();
  const { data: rooms, isLoading: isLoadingRooms } = useGetRoomsQuery();

  const [updateSession, { isLoading: isUpdating }] = useUpdateSessionMutation();
  const [createAvailableTimeRanges] = useCreateAvailableTimeRangesMutation(); // Add this

  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [sessionPrice, setSessionPrice] = useState("");
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [selectedBookedRanges, setSelectedBookedRanges] = useState([]);

  const {
    data: availableTimeRangesResponse,
    refetch: refetchAvailableTimeRanges,
  } = useGetAvailableTimeRangesQuery(
    {
      date: selectedDate,
      cinemaId: selectedCinemaId,
      movieId: selectedMovieId,
      roomId: selectedRoomId,
    },
    {
      skip: !selectedCinemaId || !selectedMovieId || !selectedRoomId,
    }
  );

  const { data: bookedTimeRangesResponse, refetch: refetchBookedTimeRanges } =
    useGetBookedTimeRangesQuery(
      {
        date: selectedDate,
        cinemaId: selectedCinemaId,
        roomId: selectedRoomId,
      },
      {
        skip: !selectedCinemaId || !selectedRoomId || !selectedDate,
      }
    );

  useEffect(() => {
    if (session) {
      if (session.movie) {
        setSelectedMovieId(session.movie.id);
      }
      if (session.room && session.room.cinema) {
        setSelectedCinemaId(session.room.cinema.id);
        setSelectedRoomId(session.room.id);
      }
      if (session.sessionDate) {
        const formattedDate = session.sessionDate.split("T")[0];
        setSelectedDate(formattedDate);
      } else {
        setSelectedDate(new Date().toISOString().split("T")[0]);
      }
      if (session.sessionPrice) {
        setSessionPrice(session.sessionPrice);
      }
      if (session.timeRanges) {
        setSelectedRanges(
          session.timeRanges.map((range) => ({
            timeRangeStartTime: range.timeRangeStartTime,
            timeRangeEndTime: range.timeRangeEndTime,
            availableTimeRangeId: range.availableTimeRangeId,
          }))
        );
      }
    } else {
      setSelectedDate(new Date().toISOString().split("T")[0]);
    }
  }, [session]);

  useEffect(() => {
    if (selectedMovieId && selectedCinemaId && selectedRoomId && selectedDate) {
      refetchAvailableTimeRanges();
      refetchBookedTimeRanges();
    }
  }, [
    selectedMovieId,
    selectedCinemaId,
    selectedRoomId,
    selectedDate,
    refetchAvailableTimeRanges,
    refetchBookedTimeRanges,
  ]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      // Fetch available time ranges
      const { availableTimeRanges: fetchedTimeRanges } =
        await createAvailableTimeRanges({
          cinemaId: selectedCinemaId,
          roomId: selectedRoomId,
          date: selectedDate,
          movieId: selectedMovieId,
        }).unwrap();

      // Map the selected ranges with the corresponding fetched time range IDs
      const timeRanges = selectedRanges.map((range) => {
        const matchingRange = fetchedTimeRanges.find(
          (r) =>
            r.timeRangeStartTime === range.timeRangeStartTime &&
            r.timeRangeEndTime === range.timeRangeEndTime
        );
        return {
          timeRangeStartTime: range.timeRangeStartTime,
          timeRangeEndTime: range.timeRangeEndTime,
          availableTimeRangeId: matchingRange ? matchingRange.id : null,
        };
      });

      const formattedBookedRanges = selectedBookedRanges.map((range) => ({
        timeRangeStartTime: range.timeRangeStartTime,
        timeRangeEndTime: range.timeRangeEndTime,
        availableTimeRangeId: range.availableTimeRangeId,
      }));

      const payload = {
        id: id,
        movieId: parseInt(selectedMovieId, 10),
        cinemaId: parseInt(selectedCinemaId, 10),
        roomId: parseInt(selectedRoomId, 10),
        sessionDate: selectedDate,
        sessionPrice: parseFloat(sessionPrice),
        timeRanges: timeRanges,
        bookedTimeRanges: formattedBookedRanges,
      };

      await updateSession(payload).unwrap();
      toast.success("Session updated successfully!");
    } catch (error) {
      toast.error(`Failed to update session: ${error.message}`);
      console.error("Error updating session:", error);
    }
  };

  const handleTimeRangeSelection = (range) => {
    const isSelected = selectedRanges.some(
      (r) =>
        r.timeRangeStartTime === range.timeRangeStartTime &&
        r.timeRangeEndTime === range.timeRangeEndTime
    );
    if (isSelected) {
      setSelectedRanges((prevRanges) =>
        prevRanges.filter(
          (r) =>
            r.timeRangeStartTime !== range.timeRangeStartTime ||
            r.timeRangeEndTime !== range.timeRangeEndTime
        )
      );
    } else {
      setSelectedRanges((prevRanges) => [
        ...prevRanges,
        {
          ...range,
          availableTimeRangeId: range.id, // Ensure the id is included
        },
      ]);
    }
  };

  const handleBookedRangeSelection = (range) => {
    const isSelected = selectedBookedRanges.some(
      (r) =>
        r.timeRangeStartTime === range.timeRangeStartTime &&
        r.timeRangeEndTime === range.timeRangeEndTime
    );
    if (isSelected) {
      setSelectedBookedRanges((prevRanges) =>
        prevRanges.filter(
          (r) =>
            r.timeRangeStartTime !== range.timeRangeStartTime ||
            r.timeRangeEndTime !== range.timeRangeEndTime
        )
      );
    } else {
      setSelectedBookedRanges((prevRanges) => [
        ...prevRanges,
        {
          ...range,
          availableTimeRangeId: range.id, // Ensure the id is included
        },
      ]);
    }
  };

  if (
    isLoadingSessionDetails ||
    isUpdating ||
    isLoadingMovies ||
    isLoadingCinemas ||
    isLoadingRooms
  ) {
    return <LoaderFull />;
  }

  if (isErrorSessionDetails) {
    toast.error("An error occurred while fetching session details.");
    return <p>Error fetching session details.</p>;
  }

  const filteredRooms = rooms
    ? rooms.filter((room) => room.cinema.id === Number(selectedCinemaId))
    : [];

  const availableTimeRanges =
    availableTimeRangesResponse?.availableTimeRanges || [];
  const bookedTimeRanges = bookedTimeRangesResponse?.bookedTimeRanges || [];

  return (
    <>
      <div>
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Update a Session
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
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <NavLink
                    to="/admin/sessionlist"
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
                      <form onSubmit={handleUpdate}>
                        <div className="space-y-12">
                          <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                              Profile
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                              This information will be displayed publicly so be
                              careful what you share.
                            </p>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="movie_id"
                                  className="block text-sm font-medium text-gray-900"
                                >
                                  Movie
                                </label>
                                <select
                                  id="movie_id"
                                  name="movie_id"
                                  value={selectedMovieId}
                                  onChange={(e) =>
                                    setSelectedMovieId(e.target.value)
                                  }
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                  <option value="" disabled>
                                    Select a movie
                                  </option>
                                  {movies?.map((movie) => (
                                    <option key={movie.id} value={movie.id}>
                                      {movie.movieTitle}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="cinema_id"
                                  className="block text-sm font-medium text-gray-900"
                                >
                                  Cinema *
                                </label>
                                <select
                                  id="cinema_id"
                                  name="cinema_id"
                                  value={selectedCinemaId}
                                  onChange={(e) =>
                                    setSelectedCinemaId(e.target.value)
                                  }
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                  <option value="" disabled>
                                    Select a cinema
                                  </option>
                                  {cinemas?.map((cinema) => (
                                    <option key={cinema.id} value={cinema.id}>
                                      {cinema.cinemaName}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="room_id"
                                  className="block text-sm font-medium text-gray-900"
                                >
                                  Room *
                                </label>
                                {selectedCinemaId && (
                                  <>
                                    {filteredRooms.map((room) => (
                                      <div
                                        key={room.id}
                                        className="mt-2 flex items-center"
                                      >
                                        <input
                                          type="radio"
                                          id={`room-${room.id}`}
                                          name="room"
                                          value={room.id}
                                          checked={selectedRoomId === room.id}
                                          onChange={() =>
                                            setSelectedRoomId(room.id)
                                          }
                                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <label
                                          htmlFor={`room-${room.id}`}
                                          className="ml-3 block text-sm font-medium text-gray-700"
                                        >
                                          Room n°{room.id} -{" "}
                                          {room.cinema.cinemaName} -{" "}
                                          {room.roomQuality}
                                        </label>
                                      </div>
                                    ))}
                                  </>
                                )}
                              </div>
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="session_date"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Session Date
                                </label>
                                <input
                                  type="date"
                                  id="session_date"
                                  name="session_date"
                                  value={selectedDate}
                                  onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                  }
                                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="time_ranges"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Available Time Ranges
                                </label>
                                {availableTimeRanges &&
                                availableTimeRanges.length > 0 ? (
                                  availableTimeRanges.map((range, index) => {
                                    const startDate = new Date(
                                      range.timeRangeStartTime
                                    );
                                    const endDate = new Date(
                                      range.timeRangeEndTime
                                    );

                                    const formattedStartDate = `${startDate
                                      .getUTCDate()
                                      .toString()
                                      .padStart(2, "0")}/${(
                                      startDate.getUTCMonth() + 1
                                    )
                                      .toString()
                                      .padStart(
                                        2,
                                        "0"
                                      )}/${startDate.getUTCFullYear()} - ${startDate
                                      .getUTCHours()
                                      .toString()
                                      .padStart(2, "0")}:${startDate
                                      .getUTCMinutes()
                                      .toString()
                                      .padStart(2, "0")}`;
                                    const formattedEndDate = `${endDate
                                      .getUTCHours()
                                      .toString()
                                      .padStart(2, "0")}:${endDate
                                      .getUTCMinutes()
                                      .toString()
                                      .padStart(2, "0")}`;

                                    const isSelected = selectedRanges.some(
                                      (selectedRange) =>
                                        selectedRange.timeRangeStartTime ===
                                          range.timeRangeStartTime &&
                                        selectedRange.timeRangeEndTime ===
                                          range.timeRangeEndTime
                                    );

                                    return (
                                      <div
                                        key={index}
                                        className="mt-2 flex items-center"
                                      >
                                        <input
                                          type="checkbox"
                                          id={`time-range-${index}`}
                                          name={`time-range-${index}`}
                                          value={JSON.stringify(range)}
                                          checked={isSelected}
                                          onChange={() =>
                                            handleTimeRangeSelection(range)
                                          }
                                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <label
                                          htmlFor={`time-range-${index}`}
                                          className="ml-3 block text-sm font-medium text-gray-700"
                                        >
                                          {formattedStartDate} to{" "}
                                          {formattedEndDate}
                                        </label>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="mt-2 text-sm text-gray-500">
                                    No time ranges available for this session.
                                  </p>
                                )}
                              </div>
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="booked_time_ranges"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Current Booked Time Ranges
                                </label>
                                {bookedTimeRanges &&
                                bookedTimeRanges.length > 0 ? (
                                  bookedTimeRanges.map((range, index) => {
                                    const startDate = new Date(
                                      range.timeRangeStartTime
                                    );
                                    const endDate = new Date(
                                      range.timeRangeEndTime
                                    );

                                    const formattedStartDate = `${startDate
                                      .getUTCDate()
                                      .toString()
                                      .padStart(2, "0")}/${(
                                      startDate.getUTCMonth() + 1
                                    )
                                      .toString()
                                      .padStart(
                                        2,
                                        "0"
                                      )}/${startDate.getUTCFullYear()} - ${startDate
                                      .getUTCHours()
                                      .toString()
                                      .padStart(2, "0")}:${startDate
                                      .getUTCMinutes()
                                      .toString()
                                      .padStart(2, "0")}`;
                                    const formattedEndDate = `${endDate
                                      .getUTCHours()
                                      .toString()
                                      .padStart(2, "0")}:${endDate
                                      .getUTCMinutes()
                                      .toString()
                                      .padStart(2, "0")}`;

                                    const isSelected =
                                      selectedBookedRanges.some(
                                        (selectedRange) =>
                                          selectedRange.timeRangeStartTime ===
                                            range.timeRangeStartTime &&
                                          selectedRange.timeRangeEndTime ===
                                            range.timeRangeEndTime
                                      );

                                    return (
                                      <div
                                        key={index}
                                        className="mt-2 flex items-center"
                                      >
                                        <input
                                          type="checkbox"
                                          id={`booked-time-range-${index}`}
                                          name={`booked-time-range-${index}`}
                                          value={JSON.stringify(range)}
                                          checked={isSelected}
                                          onChange={() =>
                                            handleBookedRangeSelection(range)
                                          }
                                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <label
                                          htmlFor={`booked-time-range-${index}`}
                                          className="ml-3 block text-sm font-medium text-gray-700"
                                        >
                                          {formattedStartDate} to{" "}
                                          {formattedEndDate}
                                        </label>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="mt-2 text-sm text-gray-500">
                                    No booked time ranges for this session.
                                  </p>
                                )}
                              </div>
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="price"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Price *
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="price"
                                    id="price"
                                    required
                                    value={sessionPrice}
                                    onChange={(e) =>
                                      setSessionPrice(e.target.value)
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-x-6">
                          <NavLink
                            to="/admin/sessionlist"
                            className="text-sm font-semibold leading-6 text-gray-900"
                          >
                            Go Back
                          </NavLink>

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

export default SessionUpdate;
