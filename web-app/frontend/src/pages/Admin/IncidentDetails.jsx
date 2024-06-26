import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoaderFull from "../../components/LoaderFull";

import { useGetIncidentQuery } from "../../redux/api/incidentApiSlice";

const IncidentDetails = () => {
  const { id } = useParams();

  const { data: incident, isLoading, error, refetch } = useGetIncidentQuery(id);

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch incident details.");
    }
  }, [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <LoaderFull />;

  return (
    <>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Incident Details
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
                    to="/admin/incidentlist"
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
                          <div>
                            <div className="px-4 sm:px-0">
                              <h3 className="text-base font-semibold leading-7 text-gray-900">
                                Applicant Information
                              </h3>
                              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                                Personal details and application.
                              </p>
                            </div>
                            <div className="mt-6 border-t border-gray-100">
                              <dl className="divide-y divide-gray-100">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    ID
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {incident._id}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    Status
                                  </dt>
                                  <dd
                                    className={`py-1.5 px-2 max-w-fit items-center rounded-md text-xs font-medium ${
                                      incident.incidentStatus === "reported"
                                        ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                                        : incident.incidentStatus ===
                                          "in progress"
                                        ? "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                                        : "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                                    }`}
                                  >
                                    {incident.incidentStatus}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    User
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {incident.userFirstName}{" "}
                                    {incident.userLastName}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    Description
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {incident.incidentDescription}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    Room Number
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {incident.roomNumber}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    Cinema
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    <h3 className="font-semibold">Name</h3>
                                    <div>{incident.cinemaName}</div>

                                    <h3 className="font-semibold">Email</h3>

                                    <div>{incident.cinemaEmail}</div>

                                    <h3 className="font-semibold">Address</h3>
                                    <div>
                                      {incident.cinemaAddress}
                                      {incident.cinemaPostalCode}
                                      {incident.cinemaCity}{" "}
                                      {incident.cinemaCountry}
                                    </div>
                                    <h3 className="font-semibold">
                                      Telephone Number
                                    </h3>

                                    <div>{incident.cinemaTelNumber}</div>
                                    <h3 className="font-semibold">
                                      Opening Hours
                                    </h3>

                                    <div>
                                      {incident.cinemaStartTimeOpening} -{" "}
                                      {incident.cinemaEndTimeOpening}
                                    </div>
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          </div>
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

export default IncidentDetails;
