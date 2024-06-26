import React from "react";
import { useGetBookingsCountLast7DaysQuery } from "../../redux/api/bookingApiSlice";
import LoaderFull from "../../components/LoaderFull";

const AdminDashboard = () => {
  const {
    data: bookingDetails,
    error,
    isLoading,
  } = useGetBookingsCountLast7DaysQuery();

  if (isLoading) {
    return <LoaderFull />;
  }

  if (error) {
    return <div>Error: {error.data}</div>;
  }

  return (
    <>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <p className="mt-2 px-3 text-sm">
                    Retrouvez les réservations effectuées au cours des 7
                    derniers jours.
                  </p>
                </div>
              </div>
              <div className="mt-8 flow-root">
                <div className="-mx-0 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="bg-white inline-block min-w-full py-2 align-middle box-border border border-solid rounded-md border-[#e5e7eb] sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold"
                          >
                            Booking ID
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold"
                          >
                            Titre du film
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold"
                          >
                            Cinema
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold"
                          >
                            Nombre de réservations
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bookingDetails &&
                          bookingDetails.map((detail) => (
                            <tr key={detail.movieId}>
                              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {detail.bookingIds.join(", ")}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {detail.movieTitle}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm">
                                {detail.cinemaName}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm">
                                {detail.count}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {bookingDetails && bookingDetails.length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-8">
                        There are no bookings for any movie in the last 7 days.
                      </div>
                    )}
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

export default AdminDashboard;
