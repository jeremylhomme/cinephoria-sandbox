import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LoaderFull from "../../components/LoaderFull";
import { useCreateCinemaMutation } from "../../redux/api/cinemaApiSlice";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const CinemaAdd = () => {
  const [cinemaName, setCinemaName] = useState("");
  const [cinemaEmail, setCinemaEmail] = useState("");
  const [cinemaAddress, setCinemaAddress] = useState("");
  const [cinemaPostalCode, setCinemaPostalCode] = useState("");
  const [cinemaCity, setCinemaCity] = useState("");
  const [cinemaCountry, setCinemaCountry] = useState("");
  const [cinemaTelNumber, setCinemaTelNumber] = useState("");
  const [cinemaStartTimeOpening, setCinemaStartTimeOpening] = useState("");
  const [cinemaEndTimeOpening, setCinemaEndTimeOpening] = useState("");

  const [createCinema, { isLoading }] = useCreateCinemaMutation();

  const handleSubmit = async (event) => {
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
      await createCinema({
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

      resetForm();

      toast.success("Le cinéma a été ajouté avec succès");
    } catch (error) {
      toast.error("An error occurred while adding the cinema.");
      console.error("Error adding cinema:", error);
    }
  };

  const resetForm = () => {
    setCinemaName("");
    setCinemaEmail("");
    setCinemaAddress("");
    setCinemaPostalCode("");
    setCinemaCity("");
    setCinemaCountry("");
    setCinemaTelNumber("");
    setCinemaStartTimeOpening("");
    setCinemaEndTimeOpening("");
  };

  if (isLoading) return <LoaderFull />;

  return (
    <div className="py-10">
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-3xl font-bold leading-tight tracking-tight">
                  Ajouter un cinéma
                </h1>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <Link
                  to="/admin/cinemalist"
                  className="block rounded-md px-3 py-2 text-center text-sm font-semibold shadow-sm bg-gray-300 text-gray-600 hover:bg-gray-400"
                >
                  Retour
                </Link>
              </div>
            </div>
            <div className="my-12 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="rounded-md bg-white inline-block min-w-full pb-6 align-middle sm:px-6 lg:px-8">
                  <div className="min-w-full divide-y divide-gray-300">
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                              <label
                                htmlFor="cinemaName"
                                className="block text-sm font-medium leading-6"
                              >
                                Nom*
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  name="cinemaName"
                                  id="cinemaName"
                                  required
                                  value={cinemaName}
                                  onChange={(e) =>
                                    setCinemaName(e.target.value)
                                  }
                                  className="max-w-lg block w-full shadow-sm bg-transparent focus:ring-yellow-600 focus:border-yellow-600 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                              <p className="mt-3 text-sm leading-6 text-gray-400">
                                Ex : Cinéphoria Paris
                              </p>
                            </div>

                            <div className="sm:col-span-3">
                              <label
                                htmlFor="cinemaEmail"
                                className="block text-sm font-medium leading-6"
                              >
                                Email*
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
                                  className="max-w-lg block w-full shadow-sm bg-transparent focus:ring-yellow-600 focus:border-yellow-600 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                              <p className="mt-3 text-sm leading-6 text-gray-400">
                                Ex : cinema@exemple.com
                              </p>
                            </div>

                            <div className="sm:col-span-3">
                              <label
                                htmlFor="cinemaAddress"
                                className="block text-sm font-medium leading-6"
                              >
                                Adresse*
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
                                  className="max-w-lg block w-full shadow-sm bg-transparent focus:ring-yellow-600 focus:border-yellow-600 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                              <p className="mt-3 text-sm leading-6 text-gray-400">
                                Ex : 1 rue de Paris
                              </p>
                            </div>

                            <div className="sm:col-span-3">
                              <label
                                htmlFor="cinemaPostalCode"
                                className="block text-sm font-medium leading-6"
                              >
                                Code postal*
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
                                  className="max-w-lg block w-full shadow-sm bg-transparent focus:ring-yellow-600 focus:border-yellow-600 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                              <p className="mt-3 text-sm leading-6 text-gray-400">
                                Ex : 75000
                              </p>
                            </div>

                            <div className="sm:col-span-3">
                              <label
                                htmlFor="cinemaCity"
                                className="block text-sm font-medium leading-6"
                              >
                                Ville*
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
                                  className="max-w-lg block w-full shadow-sm bg-transparent focus:ring-yellow-600 focus:border-yellow-600 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                              <p className="mt-3 text-sm leading-6 text-gray-400">
                                Ex : Paris
                              </p>
                            </div>

                            <div className="sm:col-span-3">
                              <label
                                htmlFor="cinemaCountry"
                                className="block text-sm font-medium leading-6"
                              >
                                Pays*
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
                                  className="max-w-lg block w-full shadow-sm bg-transparent focus:ring-yellow-600 focus:border-yellow-600 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                              <p className="mt-3 text-sm leading-6 text-gray-400">
                                Ex : France
                              </p>
                            </div>

                            <div className="sm:col-span-3">
                              <label
                                htmlFor="cinemaTelNumber"
                                className="block text-sm font-medium leading-6"
                              >
                                Numéro de Téléphone*
                              </label>
                              <div className="mt-2">
                                <PhoneInput
                                  defaultCountry="FR"
                                  name="cinemaTelNumber"
                                  id="cinemaTelNumber"
                                  required
                                  value={cinemaTelNumber}
                                  onChange={setCinemaTelNumber}
                                  className="text-black max-w-lg block w-full shadow-sm focus:ring-yellow-600 focus:border-yellow-600 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                              <p className="mt-3 text-sm leading-6 text-gray-400">
                                Ex: +33(0) 1 12 34 56 78
                              </p>
                            </div>

                            <div className="sm:col-span-3">
                              <label
                                htmlFor="openingHours"
                                className="block text-sm font-medium leading-6"
                              >
                                Heures d'Ouverture*
                              </label>

                              <div className="mt-2 flex">
                                <div className="mr-4">
                                  <label
                                    htmlFor="cinemaStartTimeOpening"
                                    className="block text-sm font-medium leading-6"
                                  >
                                    De:
                                  </label>
                                  <input
                                    type="time"
                                    name="cinemaStartTimeOpening"
                                    id="cinemaStartTimeOpening"
                                    required
                                    value={cinemaStartTimeOpening}
                                    onChange={(e) =>
                                      setCinemaStartTimeOpening(e.target.value)
                                    }
                                    className="max-w-lg block w-full shadow-sm focus:ring-yellow-600 focus:border-yellow-600 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="cinemaEndTimeOpening"
                                    className="block text-sm font-medium leading-6"
                                  >
                                    À:
                                  </label>
                                  <input
                                    type="time"
                                    name="cinemaEndTimeOpening"
                                    id="cinemaEndTimeOpening"
                                    required
                                    value={cinemaEndTimeOpening}
                                    onChange={(e) =>
                                      setCinemaEndTimeOpening(e.target.value)
                                    }
                                    className="max-w-lg block w-full shadow-sm focus:ring-yellow-600 focus:border-yellow-600 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                          type="button"
                          className="text-center pb-2 border-b-2 text-sm font-semibold shadow-sm hover:text-gray-400 hover:border-gray-400"
                          onClick={resetForm}
                        >
                          Réinitialiser le formulaire
                        </button>
                        <button
                          type="submit"
                          className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        >
                          Sauvegarder
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
  );
};

export default CinemaAdd;
