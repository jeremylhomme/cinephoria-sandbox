import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  useGetAvailableSeatsQuery,
  useGetBookedSeatsQuery,
  useUpdateSeatMutation,
} from "../redux/api/seatApiSlice";

const AdminBookingSeatsMap = ({ sessionId, roomCapacity, refetchRooms }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [pmrSeats, setPmrSeats] = useState([]);

  const { data: availableSeatsData } = useGetAvailableSeatsQuery(sessionId);
  const { data: bookedSeatsData, refetch } = useGetBookedSeatsQuery(sessionId);
  const [updateSeat] = useUpdateSeatMutation();

  useEffect(() => {
    if (availableSeatsData) {
      setSelectedSeats(availableSeatsData.map((seat) => seat.id));
    }
  }, [availableSeatsData]);

  useEffect(() => {
    if (bookedSeatsData) {
      setPmrSeats(
        bookedSeatsData
          .filter((seat) => seat.pmrSeat)
          .map((seat) => seat.seatNumber)
      );
    }
  }, [bookedSeatsData]);

  const togglePmrSeat = (seatId) => {
    setPmrSeats((prevPmrSeats) => {
      if (prevPmrSeats.includes(seatId)) {
        return prevPmrSeats.filter((id) => id !== seatId);
      } else {
        return [...prevPmrSeats, seatId];
      }
    });
  };

  const savePmrSeats = async () => {
    try {
      await Promise.all(
        pmrSeats.map((seatId) =>
          updateSeat({
            seatId,
            updatedSeat: { pmrSeat: true },
          }).unwrap()
        )
      );
      refetch();
      refetchRooms();
      toast.success("PMR seats updated successfully!");
    } catch (error) {
      console.error("Error updating PMR seats:", error);
      toast.error("Failed to update PMR seats.");
    }
  };

  const renderSeat = (seatId, extraClasses = "") => {
    const isPmr = pmrSeats.includes(seatId);
    const isBooked =
      bookedSeatsData &&
      bookedSeatsData.some((seat) => seat.seatNumber === seatId);

    let backgroundColor = "bg-gray-700"; // Default color for available seats
    if (isPmr) {
      backgroundColor = "bg-yellow-500 border-yellow-500 border-2";
    } else if (isBooked) {
      backgroundColor = "bg-red-800";
    } else if (selectedSeats.includes(seatId)) {
      backgroundColor = "bg-blue-500";
    }

    return (
      <div
        key={seatId}
        className={`h-9 w-9 text-white text-xs rounded-tl-lg rounded-tr-lg mx-0.5 cursor-pointer flex items-center justify-center ${backgroundColor}`}
        onClick={() => togglePmrSeat(seatId)}
      >
        {seatId}
      </div>
    );
  };

  const renderSeats = () => {
    const seatsPerRow = 12; // Define seats per row
    const rows = Math.ceil(roomCapacity / seatsPerRow); // Calculate number of rows
    const seatRows = [];

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      const seatRow = [];
      for (let seatIndex = 1; seatIndex <= seatsPerRow; seatIndex++) {
        const seatId = (rowIndex * seatsPerRow + seatIndex).toString();
        if (seatId > roomCapacity) break; // Stop if we exceed room capacity
        seatRow.push(renderSeat(seatId));
      }
      seatRows.push(
        <div key={rowIndex} className="flex justify-center my-1">
          {seatRow}
        </div>
      );
    }

    return seatRows;
  };

  return (
    <div className="max-w-7xl">
      <div className="relative mb-5">
        <div className="flex flex-col w-full">{renderSeats()}</div>
        <div className="mt-4">
          <p className="text-sm mb-3 text-center">
            <span className="text-blue-500">{pmrSeats.length}</span> seats are
            selected to be PMR seats.
          </p>
          <ul className="flex justify-center mb-5 text-sm">
            <li className="flex items-center mx-2">
              <div className="h-3 w-3 bg-gray-700 rounded-tl-lg rounded-tr-lg"></div>
              <span className="ml-1">Available</span>
            </li>
            <li className="flex items-center mx-2">
              <div className="h-3 w-3 bg-red-800 rounded-tl-lg rounded-tr-lg"></div>
              <span className="ml-1">Occupied</span>
            </li>
            <li className="flex items-center mx-2">
              <div className="h-3 w-3 bg-yellow-500 border-yellow-500 border-2 rounded-tl-lg rounded-tr-lg"></div>
              <span className="ml-1">PMR</span>
            </li>
          </ul>

          <button
            onClick={savePmrSeats}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Save PMR Seats
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingSeatsMap;
