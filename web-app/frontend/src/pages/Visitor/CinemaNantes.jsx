import React from "react";
import { Link } from "react-router-dom";
import { useGetRoomsQuery } from "../../redux/api/roomApiSlice";
import CinemaImage from "../../assets/images/cinemaNantes.jpg";

const CinemaNantes = () => {
  const { data: rooms, isLoading, error } = useGetRoomsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading rooms data</p>;

  const numberOfRooms = rooms ? rooms.length : 0; // Get the number of rooms
  const totalCapacity = rooms
    ? rooms.reduce((sum, room) => sum + room.roomCapacity, 0)
    : 0; // Calculate the total capacity

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            Notre cinéma à Nantes
          </h1>
          <p className="mt-4 text-gray-600">
            Découvrez notre cinéma Cinéphoria - Nantes : horaires des séances,
            les expériences IMAX, Dolby Cinema, 4DX, ScreenX, tarifs,
            avant-premières, films à l'affiche à Nantes, sans oublier les
            informations pratiques pour vous y rendre.
          </p>
        </header>
        <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight">
                Pathé Atlantis
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                8 rue de l'Atlantique - 44800 Saint-Herblain
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Profitez de l'expérience IMAX, Dolby Cinema, et bien plus
                encore.
              </p>
              <div className="mt-3 flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {numberOfRooms} Salles
                </span>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {totalCapacity} places
                </span>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Accessible PMR
                </span>
              </div>
            </div>
            <img
              className="h-24 w-24 rounded-md object-cover"
              src={CinemaImage}
              alt="Pathé Atlantis"
            />
          </div>
          <div className="px-4 py-4 sm:px-6">
            <Link
              to="/path/to/seances"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700"
            >
              Toutes les séances
            </Link>
          </div>
        </div>
        {/* Add more cinema sections as needed */}
      </div>
    </div>
  );
};

export default CinemaNantes;
