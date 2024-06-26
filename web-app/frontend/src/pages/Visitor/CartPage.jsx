import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useGetBookingDetailsQuery,
  useSoftDeleteBookingMutation,
} from "../../redux/api/bookingApiSlice";
import LoaderFull from "../../components/LoaderFull";
import { toast } from "react-toastify";

const CartPage = () => {
  const location = useLocation();
  const { bookingId, ...bookingDetailsFromState } = location.state || {};
  const navigate = useNavigate();
  const {
    data: bookingDetailsFromAPI,
    isLoading,
    isError,
  } = useGetBookingDetailsQuery(bookingId, {
    skip: !bookingId,
  });

  const [softDeleteBooking, { isLoading: isDeleting }] =
    useSoftDeleteBookingMutation();

  const bookingDetails = bookingDetailsFromAPI || bookingDetailsFromState;

  useEffect(() => {
    if (!bookingDetails) {
      const storedBooking = localStorage.getItem("selectedBooking");
      if (storedBooking) {
        const booking = JSON.parse(storedBooking);
        navigate(`/cart`, { state: booking });
      }
    }
  }, [bookingDetails, navigate]);

  const handleConfirmBooking = () => {
    navigate(`/bookings/${bookingId}/payment`);
  };

  const handleRemoveBooking = async () => {
    const confirmCancel = window.confirm(
      "Do you really want to cancel this booking?"
    );
    if (confirmCancel) {
      try {
        await softDeleteBooking(bookingId).unwrap();
        localStorage.removeItem("selectedBooking");
        navigate("/cart");
        toast.success("Booking successfully canceled.");
      } catch (error) {
        console.error("Error removing booking:", error);
        toast.error("Failed to cancel booking.");
      }
    }
  };

  const formatDateInFrench = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("fr-FR", { weekday: "long" });
    const restOfDate = date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${day} ${restOfDate}`;
  };

  const formatTimeInUTC = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  if (isLoading || isDeleting) {
    return <LoaderFull />;
  }

  if (isError || !bookingDetails) {
    return <div>Error loading booking details</div>;
  }

  const totalPrice =
    bookingDetails?.session?.sessionPrice * bookingDetails?.seatsBooked?.length;

  return (
    <div className="py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-8 align-middle box-border border border-solid rounded-md border-[#e5e7eb] sm:px-6 lg:px-8">
          {bookingDetails && bookingDetails.movie ? (
            <>
              <h1 className="text-2xl font-medium text-gray-900 mb-4">
                Panier
              </h1>
              <div className="border-t border-gray-200">
                <div className="flex py-6">
                  <div className="flex-shrink-0">
                    <img
                      src={bookingDetails.movie.movieImg}
                      alt={bookingDetails.movie.movieTitle}
                      className="w-24 object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium">
                        <h3>{bookingDetails.movie.movieTitle}</h3>
                        <p className="ml-4">
                          {bookingDetails.session.sessionPrice.toFixed(2)}€
                        </p>
                      </div>
                      {bookingDetails.session.timeRange && (
                        <>
                          <p className="mt-1 text-sm text-gray-500">
                            Date :{" "}
                            {formatDateInFrench(
                              bookingDetails.session.timeRange
                                .timeRangeStartTime
                            )}{" "}
                            de{" "}
                            {formatTimeInUTC(
                              bookingDetails.session.timeRange
                                .timeRangeStartTime
                            )}{" "}
                            à{" "}
                            {formatTimeInUTC(
                              bookingDetails.session.timeRange.timeRangeEndTime
                            )}
                          </p>
                        </>
                      )}
                      <p className="text-sm text-gray-500 mt-1 mr-2">
                        Sièges sélectionnés :{" "}
                        {bookingDetails.seatsBooked.map((seat, index) => (
                          <span
                            key={seat.id}
                            className="bg-gray-100 rounded-md py-1 px-2 mx-1 inline-block ml-1"
                          >
                            {seat.seatNumber}
                            {index < bookingDetails.seatsBooked.length - 1}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className="flex items-end justify-between text-sm">
                      <p className="mt-1 text-sm text-gray-500">
                        Nombre de sièges : {bookingDetails.seatsBooked.length}
                      </p>

                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={handleRemoveBooking}
                        disabled={isDeleting} // Disable button while deleting
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between text-base font-medium">
                  <p>Sous-total</p>
                  <p>{totalPrice.toFixed(2)}€</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">TVA incluse</p>
                <div className="mt-6">
                  <button
                    onClick={handleConfirmBooking}
                    className="mx-auto block rounded-md px-3 py-2 text-sm font-semibold shadow-sm bg-green-700 text-white hover:bg-green-800 focus-visible:outline-green-600"
                  >
                    Confirmer
                  </button>
                </div>
                <div className="mt-2 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    ou
                    <br />
                    <button
                      type="button"
                      className="mt-2 font-medium underline"
                      onClick={() => navigate("/movies")}
                    >
                      Parcourir les films
                    </button>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl mb-4">Votre panier est vide</h2>
              <p className="text-gray-500 mb-4">
                Vous n'avez pas encore ajouté de film à votre panier.
              </p>
              <button
                onClick={() => navigate("/movies")}
                className="px-6 py-3 mt-3 border border-transparent text-sm font-medium rounded-md shadow-sm bg-green-700 hover:bg-green-800 text-white"
              >
                Parcourir les films
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
