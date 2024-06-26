import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoaderFull from "../../components/LoaderFull";

import {} from "../../redux/api/cinemaApiSlice";

import PhoneInput from "react-phone-number-input";

const CinemaUpdate = () => {
  const { id } = useParams();

  const [updateCinema] = useUpdateCinemaMutation();

  const {
    data: cinema,
    isFetching,
    isErrorCinemas,
  } = useGetCinemaDetailsQuery(id);

  const [cinemaName, setCinemaName] = useState("");
  const [cinemaEmail, setCinemaEmail] = useState("");
  const [cinemaAddress, setCinemaAddress] = useState("");
  const [cinemaPostalCode, setCinemaPostalCode] = useState("");
  const [cinemaCity, setCinemaCity] = useState("");
  const [cinemaCountry, setCinemaCountry] = useState("");
  const [cinemaTelNumber, setCinemaTelNumber] = useState("");
  const [cinemaStartTimeOpening, setCinemaStartTimeOpening] = useState("");
  const [cinemaEndTimeOpening, setCinemaEndTimeOpening] = useState("");

  useEffect(() => {
    if (cinema) {
      setCinemaName(cinema.cinemaName);
      setCinemaEmail(cinema.cinemaEmail);
      setCinemaAddress(cinema.cinemaAddress);
      setCinemaPostalCode(cinema.cinemaPostalCode);
      setCinemaCity(cinema.cinemaCity);
      setCinemaCountry(cinema.cinemaCountry);
      setCinemaTelNumber(cinema.cinemaTelNumber);
      setCinemaStartTimeOpening(cinema.cinemaStartTimeOpening);
      setCinemaEndTimeOpening(cinema.cinemaEndTimeOpening);
    }
  }, [cinema]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (
      !cinemaName ||
      !cinemaEmail ||
      !cinemaAddress ||
      !cinemaPostalCode ||
      !cinemaCity ||
      !cinemaCountry ||
      !cinemaTelNumber ||
      !cinemaStartTimeOpening ||
      !cinemaEndTimeOpening
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const updatedCinema = await updateCinema({
        id: cinema.id,
        cinemaName,
        cinemaEmail,
        cinemaAddress,
        cinemaPostalCode,
        cinemaCity,
        cinemaCountry,
        cinemaTelNumber,
        cinemaStartTimeOpening,
        cinemaEndTimeOpening,
      }).unwrap();

      toast.success("Cinema updated successfully!");
    } catch (error) {
      toast.error("Failed to update cinema: " + error.data?.error.message);
    }
  };

  if (isFetching) return <LoaderFull />;
  if (isErrorCinemas) return <p>Error fetching categories.</p>;

  return (
    <>
      <div>
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Update a Cinema
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
                    to="/admin/cinemalist"
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
                                  htmlFor="name"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Name *
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="name"
                                    id="cinemaName"
                                    required
                                    value={cinemaName}
                                    onChange={(e) =>
                                      setCinemaName(e.target.value)
                                    }
                                    placeholder="Enter the cinema name"
                                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                    aria-describedby="cinemaNameHelp"
                                  />
                                  <p
                                    id="cinemaNameHelp"
                                    className="mt-2 text-sm text-gray-500"
                                  >
                                    Enter the name of the cinema.
                                  </p>
                                </div>
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="email"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Email *
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="email"
                                    name="cinemaEmail"
                                    id="cinemaEmail"
                                    required
                                    value={cinemaEmail}
                                    onChange={(e) =>
                                      setCinemaEmail(e.target.value)
                                    }
                                    placeholder="Enter the email"
                                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                    aria-describedby="cinemaEmailHelp"
                                  />
                                  <p
                                    id="cinemaEmailHelp"
                                    className="mt-2 text-sm text-gray-500"
                                  >
                                    Enter the email of the cinema.
                                  </p>
                                </div>
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="address"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Address *
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="cinemaAddress"
                                    id="cinemaAddress"
                                    required
                                    value={cinemaAddress}
                                    onChange={(e) =>
                                      setCinemaAddress(e.target.value)
                                    }
                                    placeholder="Enter the address"
                                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                    aria-describedby="cinemaAddressHelp"
                                  />
                                  <p
                                    id="cinemaAddressHelp"
                                    className="mt-2 text-sm text-gray-500"
                                  >
                                    Enter the address of the cinema.
                                  </p>
                                </div>
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="postalCode"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Postal Code *
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="cinemaPostalCode"
                                    id="cinemaPostalCode"
                                    required
                                    value={cinemaPostalCode}
                                    onChange={(e) =>
                                      setCinemaPostalCode(e.target.value)
                                    }
                                    placeholder="Enter the postal code"
                                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                    aria-describedby="cinemaPostalCodeHelp"
                                  />
                                  <p
                                    id="cinemaPostalCodeHelp"
                                    className="mt-2 text-sm text-gray-500"
                                  >
                                    Enter the postal code of the cinema.
                                  </p>
                                </div>
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="city"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  City *
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="cinemaCity"
                                    id="cinemaCity"
                                    required
                                    value={cinemaCity}
                                    onChange={(e) =>
                                      setCinemaCity(e.target.value)
                                    }
                                    placeholder="Enter the city"
                                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                    aria-describedby="cinemaCityHelp"
                                  />
                                  <p
                                    id="cinemaCityHelp"
                                    className="mt-2 text-sm text-gray-500"
                                  >
                                    Enter the city of the cinema.
                                  </p>
                                </div>
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="country"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Country *
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="cinemaCountry"
                                    id="cinemaCountry"
                                    required
                                    value={cinemaCountry}
                                    onChange={(e) =>
                                      setCinemaCountry(e.target.value)
                                    }
                                    placeholder="Enter the country"
                                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                    aria-describedby="cinemaCountryHelp"
                                  />
                                  <p
                                    id="cinemaCountryHelp"
                                    className="mt-2 text-sm text-gray-500"
                                  >
                                    Enter the country of the cinema.
                                  </p>
                                </div>
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="telNumber"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Telephone Number *
                                </label>
                                <div className="mt-2">
                                  <PhoneInput
                                    defaultCountry="FR"
                                    name="cinemaTelNumber"
                                    id="cinemaTelNumber"
                                    required
                                    value={cinemaTelNumber}
                                    onChange={setCinemaTelNumber}
                                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                    aria-describedby="cinemaTelNumberHelp"
                                  />
                                  <p
                                    id="cinemaTelNumberHelp"
                                    className="mt-2 text-sm text-gray-500"
                                  >
                                    Enter the telephone number of the cinema.
                                  </p>
                                </div>
                              </div>

                              <div className="sm:col-span-1">
                                <label
                                  htmlFor="openingHours"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Opening Hours *
                                </label>
                                <div className="mt-2 flex">
                                  <div className="mr-4">
                                    <label
                                      htmlFor="from"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    ></label>

                                    <input
                                      type="time"
                                      name="cinemaStartTimeOpening"
                                      id="cinemaStartTimeOpening"
                                      required
                                      value={cinemaStartTimeOpening}
                                      onChange={(e) =>
                                        setCinemaStartTimeOpening(
                                          e.target.value
                                        )
                                      }
                                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                      aria-describedby="cinemaStartTimeOpeningHelp"
                                    />
                                    <p
                                      id="cinemaStartTimeOpeningHelp"
                                      className="mt-2 text-sm text-gray-500"
                                    >
                                      From:
                                    </p>
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="to"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    ></label>
                                    <input
                                      type="time"
                                      name="cinemaEndTimeOpening"
                                      id="cinemaEndTimeOpening"
                                      required
                                      value={cinemaEndTimeOpening}
                                      onChange={(e) =>
                                        setCinemaEndTimeOpening(e.target.value)
                                      }
                                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                      aria-describedby="cinemaEndTimeOpeningHelp"
                                    />
                                    <p
                                      id="cinemaEndTimeOpeningHelp"
                                      className="mt-2 text-sm text-gray-500"
                                    >
                                      To:
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-x-6">
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

export default CinemaUpdate;
