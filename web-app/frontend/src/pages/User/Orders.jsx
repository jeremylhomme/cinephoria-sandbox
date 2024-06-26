import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LoaderFull from "../../components/LoaderFull";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { useGetUserBookingsQuery } from "../../redux/api/userApiSlice";
import { useSoftDeleteBookingMutation } from "../../redux/api/bookingApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Orders = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  const {
    data: bookings,
    isLoading,
    isError,
    refetch,
  } = useGetUserBookingsQuery(userInfo?.id);
  const navigate = useNavigate();
  const [softDeleteBooking] = useSoftDeleteBookingMutation();

  useEffect(() => {
    if (triggerRefetch) {
      refetch();
      setTriggerRefetch(false);
    }
  }, [triggerRefetch, refetch]);

  const handleGenerateQR = (booking) => {
    setCurrentBooking(booking);
    setIsQRModalOpen(true);
  };

  const handleCompleteOrder = (bookingId) => {
    navigate(`/bookings/${bookingId}/payment`);
  };

  const handleCancelOrder = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Do you really want to cancel this order?"
    );
    if (confirmCancel) {
      setIsDeleting(true);
      try {
        await softDeleteBooking(bookingId).unwrap();
        toast.success("Booking successfully canceled");
        setTriggerRefetch(true);
      } catch (error) {
        console.error("Error canceling booking:", error);
        toast.error("Error canceling booking");
      } finally {
        setIsDeleting(false);
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

  const generateQRData = (booking) => {
    return {
      bookingId: booking._id,
      movieTitle: booking.movie.movieTitle,
      sessionDate: booking.timeRange
        ? `${formatDateInFrench(
            booking.timeRange.timeRangeStartTime
          )} de ${formatTimeInUTC(
            booking.timeRange.timeRangeStartTime
          )} à ${formatTimeInUTC(booking.timeRange.timeRangeEndTime)}`
        : "N/A",
      cinemaName: booking.room?.cinema?.cinemaName || "N/A",
      seats: booking.seatsBooked.map((seat) => seat.seatNumber).join(", "),
    };
  };

  if (isLoading || isDeleting) return <LoaderFull />;

  if (isError) return <div>Error loading bookings</div>;

  return (
    <div className="max-w-4xl px-8 py-16 mx-auto bg-white rounded-md my-12">
      <h1 className="text-xl mb-4">Commandes</h1>
      <ToastContainer />
      {bookings?.length > 0 ? (
        <div className="space-y-6">
          {bookings
            .filter((booking) => booking.bookingStatus !== "cancelled")
            .map((booking) => (
              <div key={booking._id} className="border-t border-gray-200 pt-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <img
                      src={`${booking.movie.movieImg}`}
                      alt={booking.movie.movieTitle}
                      className="w-24 object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1 flex flex-col">
                    <h3 className="mb-2">Commande n°{booking._id}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Date de la réservation :{" "}
                      {booking.bookingCreatedAt
                        ? formatDateInFrench(booking.bookingCreatedAt)
                        : "N/A"}{" "}
                      à{" "}
                      {booking.bookingCreatedAt
                        ? formatTimeInUTC(booking.bookingCreatedAt)
                        : "N/A"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Montant payé : {booking.bookingPrice.toFixed(2)} €
                    </p>
                    <p className="text-sm text-gray-500 mt-1 mr-2">
                      Sièges sélectionnés :{" "}
                      {booking.seatsBooked.map((seat, index) => (
                        <span
                          key={seat.id}
                          className="bg-gray-100 rounded-md py-1 px-2 mx-1 inline-block ml-1"
                        >
                          {seat.seatNumber}
                          {index < booking.seatsBooked.length - 1}
                        </span>
                      ))}
                    </p>
                    <h3 className="mt-4 mb-2">Votre séance</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Film : {booking.movie.movieTitle}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Date de la séance :{" "}
                      {booking.timeRange
                        ? formatDateInFrench(
                            booking.timeRange.timeRangeStartTime
                          )
                        : "N/A"}{" "}
                      de{" "}
                      {booking.timeRange
                        ? formatTimeInUTC(booking.timeRange.timeRangeStartTime)
                        : "N/A"}{" "}
                      à{" "}
                      {booking.timeRange
                        ? formatTimeInUTC(booking.timeRange.timeRangeEndTime)
                        : "N/A"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Salle n° {booking.session.room?.roomNumber || "N/A"}
                    </p>

                    <h3 className="mt-4 mb-2">Votre cinéma</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {booking.session?.cinema?.cinemaName || "N/A"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {booking.session?.cinema?.cinemaAddress || "N/A"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {booking.session?.cinema?.cinemaPostalCode || "N/A"} {""}
                      {booking.session?.cinema?.cinemaCity || "N/A"}
                      {""}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {booking.session?.cinema?.cinemaCountry || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center space-x-2 mt-8">
                  {booking.bookingStatus === "confirmed" ? (
                    <button
                      onClick={() => handleGenerateQR(booking)}
                      className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-md hover:bg-green-800"
                    >
                      Afficher le QR Code
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleCompleteOrder(booking._id)}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                      >
                        Complete Order
                      </button>
                      <button
                        onClick={() => handleCancelOrder(booking._id)}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg font-medium text-gray-500">
            You have no bookings yet.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            Browse movies and make your first booking to see it here.
          </p>
        </div>
      )}
      {currentBooking && (
        <Modal
          isOpen={isQRModalOpen}
          onRequestClose={() => setIsQRModalOpen(false)}
          contentLabel="QR Code"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75"
        >
          <div className="relative bg-white p-4 rounded-lg max-w-3xl w-full">
            <button
              onClick={() => setIsQRModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 text-2xl hover:text-gray-900"
            >
              &times;
            </button>
            <div className="flex justify-center">
              <QRCode
                value={JSON.stringify({
                  bookingConfirmed: "Booking confirmed.",
                  details: generateQRData(currentBooking),
                })}
                size={256}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Orders;
