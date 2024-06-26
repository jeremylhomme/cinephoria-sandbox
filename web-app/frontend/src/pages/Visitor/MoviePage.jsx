import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoaderFull from "../../components/LoaderFull";
import { useGetMovieDetailsQuery } from "../../redux/api/movieApiSlice";
import { useGetSessionDetailsQuery } from "../../redux/api/sessionApiSlice";
import { useCreateOrUpdateBookingMutation } from "../../redux/api/bookingApiSlice";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { MdWheelchairPickup } from "react-icons/md";
import {} from "@heroicons/react/24/outline";
import Modal from "react-modal";

Modal.setAppElement("#root");

const MoviePage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: movie,
    isError: movieError,
    isLoading: movieLoading,
  } = useGetMovieDetailsQuery(movieId);

  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [createOrUpdateBooking] = useCreateOrUpdateBookingMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: sessionDetails,
    isLoading: sessionDetailsLoading,
    isError: sessionDetailsError,
    refetch: refetchSessionDetails,
  } = useGetSessionDetailsQuery(
    selectedTimeRange ? selectedTimeRange.sessionId : skipToken
  );

  useEffect(() => {
    if (movieError) {
      toast.error("An error occurred while fetching movie details.");
      console.error("Error fetching movie details:", movieError);
    }
  }, [movieError]);

  useEffect(() => {
    if (sessionDetailsError) {
      toast.error("An error occurred while fetching session details.");
      console.error("Error fetching session details:", sessionDetailsError);
    }
  }, [sessionDetailsError]);

  useEffect(() => {
    if (selectedTimeRange) {
      refetchSessionDetails();
    }
  }, [selectedTimeRange, refetchSessionDetails]);

  const handleTimeRangeSelect = (session, timeRange) => {
    if (!userInfo) {
      toast.error(
        "Veuillez vous connecter pour afficher les places disponibles."
      );
      return;
    }

    if (!session.room || !session.room.id) {
      console.error("Room information is missing in the session object");
      return;
    }

    setSelectedTimeRange({
      sessionId: session.id.toString(),
      roomId: session.room.id,
      cinemaId: session.cinema.id,
      cinemaName: session.cinema.cinemaName,
      movieId: movie.id,
      timeRangeId: timeRange.id,
      timeRangeStartTime: timeRange.timeRangeStartTime,
      timeRangeEndTime: timeRange.timeRangeEndTime,
      roomCapacity: session.room.roomCapacity,
    });
  };

  const handleSeatSelect = (seat) => {
    setSelectedSeats((prev) => {
      const seatExists = prev.some(
        (selectedSeat) => selectedSeat.id === seat.id
      );
      if (seatExists) {
        return prev.filter((selectedSeat) => selectedSeat.id !== seat.id);
      } else if (prev.length < 9) {
        return [...prev, seat];
      } else {
        alert("You can select up to 9 seats only.");
        return prev;
      }
    });
  };

  const handleBooking = async () => {
    const bookingDetails = {
      movie,
      session: {
        ...selectedTimeRange,
        sessionPrice: sessionDetails?.session?.sessionPrice,
        roomId: selectedTimeRange.roomId,
      },
      seatsBooked: selectedSeats.map((seat) => ({
        seatId: seat.id,
        seatNumber: seat.seatNumber,
        status: "pending",
        pmrSeat: seat.pmrSeat !== undefined ? seat.pmrSeat : false,
      })),
      timeRange: {
        timeRangeId: selectedTimeRange.timeRangeId,
        timeRangeStartTime: selectedTimeRange.timeRangeStartTime,
        timeRangeEndTime: selectedTimeRange.timeRangeEndTime,
      },
      bookingPrice:
        sessionDetails?.session?.sessionPrice * selectedSeats.length,
      bookingStatus: "pending",
    };

    if (!userInfo) {
      localStorage.setItem("selectedBooking", JSON.stringify(bookingDetails));
      navigate(`/movie/${movieId}/auth`);
    } else {
      try {
        const response = await createOrUpdateBooking({
          ...bookingDetails,
          sessionId: parseInt(selectedTimeRange.sessionId),
          userId: parseInt(userInfo.id),
          movieId: parseInt(movie.id),
          roomId: parseInt(selectedTimeRange.roomId),
          cinemaId: parseInt(selectedTimeRange.cinemaId),
        }).unwrap();

        const pendingBookingId = response.booking._id;

        localStorage.setItem(
          "selectedBooking",
          JSON.stringify({ ...bookingDetails, bookingId: pendingBookingId })
        );
        navigate(`/cart`, {
          state: { ...bookingDetails, bookingId: pendingBookingId },
        });
      } catch (error) {
        console.error("Error creating booking:", error);
        toast.error("Failed to create booking.");
      }
    }
  };

  const renderSeat = (seat) => {
    const isBooked = seat.status === "booked";
    const isPmr = seat.pmrSeat;

    let seatColor = "border-2 bg-transaprent border-yellow-600";
    if (isBooked) {
      seatColor = "bg-gray-300 opacity-50";
    } else if (
      selectedSeats.some((selectedSeat) => selectedSeat.id === seat.id)
    ) {
      seatColor = "bg-yellow-600 text-white";
    } else if (isPmr) {
      seatColor = "bg-blue-600 text-white";
    }

    return (
      <div
        key={seat.id}
        className={`h-7 w-7 text-xs rounded-tl-lg rounded-tr-lg mx-0.5 cursor-pointer flex flex-col items-center justify-center ${seatColor}`}
        onClick={!isBooked ? () => handleSeatSelect(seat) : null}
      >
        <span>{seat.seatNumber}</span>
        {isPmr && <MdWheelchairPickup size={14} />}
      </div>
    );
  };

  const renderSeats = (seats, roomCapacity) => {
    const seatsPerRow = 10;
    const totalRows = Math.ceil(seats.length / seatsPerRow);

    const seatGrid = Array.from({ length: totalRows }, () =>
      Array(seatsPerRow).fill(null)
    );

    seats.forEach((seat) => {
      const seatNumber = parseInt(seat.seatNumber, 10) - 1;
      const row = Math.floor(seatNumber / seatsPerRow);
      const col = seatNumber % seatsPerRow;

      // Ensure seat statuses are defined
      const seatStatuses = seat.statuses || [];

      // Check seat status for the selected time range
      const seatStatus = seatStatuses.find(
        (status) => status.timeRangeId === selectedTimeRange.timeRangeId
      );

      const updatedSeat = {
        ...seat,
        status: seatStatus ? seatStatus.status : seat.status,
        pmrSeat: seat.pmrSeat,
      };

      seatGrid[row][col] = updatedSeat;
    });

    return (
      <div className="flex flex-col items-start">
        {seatGrid.map((row, rowIndex) => {
          const actualSeatsInRow = row.filter((seat) => seat !== null).length;
          const leftPadding = Math.floor((seatsPerRow - actualSeatsInRow) / 2);
          const rightPadding = seatsPerRow - actualSeatsInRow - leftPadding;

          return (
            <div key={rowIndex} className="flex justify-center my-1">
              {Array.from({ length: leftPadding }).map((_, index) => (
                <div key={`left-${index}`} className="h-7 w-7 mx-0.5"></div>
              ))}
              {row.map((seat, colIndex) => (
                <div key={colIndex} className="mx-0.5">
                  {seat ? (
                    renderSeat(seat)
                  ) : (
                    <div className="h-7 w-7 mx-0.5"></div>
                  )}
                </div>
              ))}
              {Array.from({ length: rightPadding }).map((_, index) => (
                <div key={`right-${index}`} className="h-7 w-7 mx-0.5"></div>
              ))}
            </div>
          );
        })}
        <div className="w-full mt-4">
          <svg
            viewBox="0 0 800 80"
            preserveAspectRatio="xMidYMid meet"
            className="block w-96 h-auto"
          >
            <path
              d="M0 30 Q400 70 800 30"
              stroke="black"
              strokeWidth="3"
              fill="none"
            />
            <text x="400" y="25" textAnchor="middle" fontSize="30" fill="black">
              Écran
            </text>
          </svg>
        </div>
        <div className="mt-4 w-96">
          <ul className="flex text-sm justify-center">
            <li className="flex items-center mx-2">
              <div className="h-3 w-3 border-2 bg-transaprent border-yellow-600 rounded-tl-lg rounded-tr-lg"></div>
              <span className="ml-1">Available</span>
            </li>
            <li className="flex items-center mx-2">
              <div className="h-3 w-3 bg-gray-300 opacity-50 rounded-tl-lg rounded-tr-lg"></div>
              <span className="ml-1">Occupied</span>
            </li>
            <li className="flex items-center mx-2">
              <div className="h-3 w-3 bg-blue-600 border-blue-600 border-2 rounded-tl-lg rounded-tr-lg"></div>
              <span className="ml-1">PMR</span>
            </li>
          </ul>
          <p className="text-sm mt-3 ml-2 text-center">
            <span className="text-base">{selectedSeats.length}</span> seats
            selected.
          </p>
        </div>
      </div>
    );
  };

  const formatDateInFrench = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("fr-FR", { weekday: "long" });
    const restOfDate = date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return { day, restOfDate };
  };

  const formatTimeInUTC = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  if (movieLoading || sessionDetailsLoading) return <LoaderFull />;
  if (movieError || sessionDetailsError)
    return <div>Error loading movie or session details</div>;

  const availableCinemas = movie?.sessions
    .map((session) => session.cinema)
    .filter(
      (cinema, index, self) =>
        index === self.findIndex((c) => c.id === cinema.id)
    );

  const getUpcomingSessions = (cinemaId) => {
    const availableSessions = movie?.sessions.filter(
      (session) => session.cinema.id === parseInt(cinemaId)
    );

    const currentDateTime = new Date().toISOString();

    return availableSessions
      ?.map((session) => {
        return {
          ...session,
          timeRanges: session.timeRanges.filter(
            (timeRange) => timeRange.timeRangeEndTime > currentDateTime
          ),
        };
      })
      .filter((session) => session.timeRanges.length > 0);
  };

  return (
    <>
      <div className="w-4/5 mx-auto py-12">
        <div className="relative max-w-4xl flex flex-col lg:flex-row">
          <div className="p-8 w-full lg:w-1/2 flex flex-col">
            <div className="relative">
              <img
                src={movie.movieImg}
                alt={movie.movieTitle}
                className="w-full object-cover rounded-lg"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute inset-0 flex items-center justify-center text-white text-6xl"
              >
                <PlayIcon className="w-20 h-20 bg-black bg-opacity-50 rounded-full p-2" />
              </button>
            </div>
          </div>

          <div className="w-fit flex flex-col py-8">
            {movie.movieFavorite && (
              <span className="w-fit py-1.5 px-2 mb-4 inline-flex items-center font-semibold text-white rounded-md text-sm bg-red-700">
                Coup de coeur
              </span>
            )}
            <h1 className="text-4xl font-bold mb-4">{movie.movieTitle}</h1>
            <div className="flex flex-col mb-4">
              <p className="text-gray-400 mb-2">
                Date de sortie :{" "}
                {formatDateInFrench(movie.movieReleaseDate).restOfDate}
              </p>
              <p className="text-gray-400 mb-2">
                {movie.movieLength} min &bull;{" "}
                {movie.categories
                  .map((category) => category.categoryName)
                  .join(", ")}
              </p>
              <p className="text-gray-400 mb-2">Note : {movie.rating}/10</p>
            </div>
            <p className="text-gray-700 mb-4">{movie.movieDescription}</p>
          </div>
        </div>

        <div className="px-8 max-w-4xl pb-12 w-full">
          {availableCinemas.map((cinema) => {
            const upcomingSessions = getUpcomingSessions(cinema.id);
            return (
              <div key={cinema.id} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{cinema.cinemaName}</h2>
                {upcomingSessions && upcomingSessions.length > 0 ? (
                  <div className="flex flex-row space-x-2 mb-8">
                    {upcomingSessions.map((session) =>
                      session.timeRanges.map((timeRange, index) => (
                        <div
                          key={index}
                          onClick={
                            userInfo
                              ? () => handleTimeRangeSelect(session, timeRange)
                              : null
                          }
                          className={`p-2 text-center text-sm cursor-pointer ${
                            selectedTimeRange?.timeRangeStartTime ===
                            timeRange.timeRangeStartTime
                              ? "bg-green-700 rounded-md text-white ring-1 ring-inset ring-green-600/20"
                              : "border rounded-md border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                          } ${!userInfo && "cursor-not-allowed opacity-50"}`}
                        >
                          <p className="text-sm">
                            {
                              formatDateInFrench(timeRange.timeRangeStartTime)
                                .day
                            }{" "}
                            <br />
                            {
                              formatDateInFrench(timeRange.timeRangeStartTime)
                                .restOfDate
                            }
                          </p>
                          <p className="mt-2">
                            {formatTimeInUTC(timeRange.timeRangeStartTime)}{" "}
                            {" - "}
                            {formatTimeInUTC(timeRange.timeRangeEndTime)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No upcoming sessions available.
                  </p>
                )}
              </div>
            );
          })}
          {selectedTimeRange &&
            sessionDetails &&
            sessionDetails.session &&
            Array.isArray(sessionDetails.session.room.seats) && (
              <div className="mt-8">
                {renderSeats(
                  sessionDetails.session.room.seats,
                  selectedTimeRange.roomCapacity
                )}
              </div>
            )}

          {!userInfo && (
            <Link to={`/login?redirect=${location.pathname}${location.search}`}>
              <p className="underline py-1.5 px-2 inline-flex items-center rounded-md text-sm font-medium bg-yellow-500 hover:bg-yellow-600">
                Connectez-vous ou créez un compte pour réserver vos places.
              </p>
            </Link>
          )}

          {userInfo && (
            <button
              onClick={handleBooking}
              className={`mt-8 ${
                selectedTimeRange && selectedSeats.length > 0
                  ? "bg-green-700 text-white"
                  : "bg-gray-300"
              } block rounded-md px-3 py-2 text-center text-sm font-semibold shadow-sm`}
              disabled={!selectedTimeRange || selectedSeats.length === 0}
            >
              Réserver
            </button>
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Movie Trailer"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75"
        >
          <div className="relative bg-white p-4 rounded-lg max-w-3xl w-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-14 -right-10 text-gray-50 text-4xl hover:text-gray-400"
            >
              &times;
            </button>
            <video
              src={movie.movieTrailerUrl}
              controls
              className="w-full h-auto"
            />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default MoviePage;
