import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const BookingSeatsMap = ({ initialSeats, onSeatSelect, roomCapacity }) => {
  const [selectedSeats, setSelectedSeats] = useState(initialSeats || []);
  const [pmrSeats, setPmrSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    fetchSeats();
    if (initialSeats !== undefined) {
      setSelectedSeats(initialSeats);
    }
    setSelectedSeats(initialSeats || []);
  }, [initialSeats]);

  const fetchSeats = async () => {
    try {
      const [availableRes, bookedRes] = await Promise.all([
        axios.get("/api/seats/available"),
        axios.get("/api/seats/booked"),
      ]);
      setAvailableSeats(availableRes.data);
      setBookedSeats(bookedRes.data);
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };

  const toggleSeatSelect = (seatId) => {
    let updatedSeats = [];
    if (selectedSeats.includes(seatId)) {
      updatedSeats = selectedSeats.filter((id) => id !== seatId);
    } else if (selectedSeats.length < 9) {
      updatedSeats = [...selectedSeats, seatId];
    } else {
      toast.error("You cannot select more than 9 seats.");
      return;
    }
    setSelectedSeats(updatedSeats);
    onSeatSelect(updatedSeats);
  };

  const togglePmrSeat = (seatId) => {
    let updatedPmrSeats = [];
    if (pmrSeats.includes(seatId)) {
      updatedPmrSeats = pmrSeats.filter((id) => id !== seatId);
    } else {
      updatedPmrSeats = [...pmrSeats, seatId];
    }
    setPmrSeats(updatedPmrSeats);
  };

  const savePmrSeats = async () => {
    try {
      await Promise.all(
        pmrSeats.map((seatId) =>
          axios.put(`/api/seats/${seatId}`, { pmrSeat: true })
        )
      );
      toast.success("PMR seats updated successfully!");
      fetchSeats(); // Refresh seat data
    } catch (error) {
      console.error("Error updating PMR seats:", error);
      toast.error("Failed to update PMR seats.");
    }
  };

  const renderSeat = (seatId, extraClasses = "") => (
    <div
      key={seatId}
      className={`h-9 w-9 text-white text-xs rounded-tl-lg rounded-tr-lg mx-0.5 cursor-pointer flex items-center justify-center ${extraClasses} ${
        selectedSeats.includes(seatId) ? "bg-blue-500" : "bg-gray-700"
      } ${pmrSeats.includes(seatId) ? "border-yellow-500 border-2" : ""}`}
      onClick={() => toggleSeatSelect(seatId)}
      onDoubleClick={() => togglePmrSeat(seatId)}
    >
      {seatId}
    </div>
  );

  const renderSeats = () => {
    const seatsPerRow = 12; // Define seats per row
    const rows = Math.ceil(roomCapacity / seatsPerRow); // Calculate number of rows
    const seatRows = [];

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      const seatRow = [];
      for (let seatIndex = 1; seatIndex <= seatsPerRow; seatIndex++) {
        const seatId = rowIndex * seatsPerRow + seatIndex;
        if (seatId > roomCapacity) break; // Stop if we exceed room capacity
        const isBooked = bookedSeats.includes(seatId);
        seatRow.push(renderSeat(seatId, isBooked ? "bg-red-800" : ""));
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
            {" "}
            <span className="text-blue-500">{selectedSeats.length}</span> seats
            are selected for this booking.
          </p>
          <ul className="flex justify-center mb-5 text-sm">
            <li className="flex items-center mx-2">
              <div className="h-3 w-3 bg-gray-700 rounded-tl-lg rounded-tr-lg"></div>
              <span className="ml-1">Available</span>
            </li>
            <li className="flex items-center mx-2">
              <div className="h-3 w-3 bg-blue-500 rounded-tl-lg rounded-tr-lg"></div>
              <span className="ml-1">Selected</span>
            </li>
            <li className="flex items-center mx-2">
              <div className="h-3 w-3 bg-red-800 rounded-tl-lg rounded-tr-lg"></div>
              <span className="ml-1">Occupied</span>
            </li>
            <li className="flex items-center mx-2">
              <div className="h-3 w-3 border-yellow-500 border-2 rounded-tl-lg rounded-tr-lg"></div>
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

export default BookingSeatsMap;
