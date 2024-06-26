import React from "react";
import { useGetCinemasQuery } from "../../redux/api/cinemaApiSlice";
import LoaderFull from "../../components/LoaderFull";

const ContactPage = () => {
  const {
    data: cinemas,
    isError: cinemasError,
    isLoading: cinemasLoading,
  } = useGetCinemasQuery();

  if (cinemasLoading) return <LoaderFull />;
  if (cinemasError) return <div>Error loading data</div>;

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Contactez-nous
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Nous sommes à votre écoute pour toute question ou demande de
                renseignement.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
              {cinemas.map((cinema) => (
                <div key={cinema.id} className="rounded-2xl bg-gray-50 p-10">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">
                    {cinema.cinemaName}
                  </h3>
                  <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                    <div>
                      <dt className="sr-only">Email</dt>
                      <dd>
                        <a
                          className="font-semibold text-yellow-600"
                          href={`mailto:${cinema.cinemaEmail}`}
                        >
                          {cinema.cinemaEmail}
                        </a>
                      </dd>
                    </div>
                    <div className="mt-1">
                      <dt className="sr-only">Phone number</dt>
                      <dd>{cinema.cinemaTelNumber}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 pt-16 lg:grid-cols-3">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Locations
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Retrouvez-nous dans les villes suivantes :
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
              {cinemas.map((cinema) => (
                <div key={cinema.id} className="rounded-2xl bg-gray-50 p-10">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">
                    {cinema.cinemaName}
                  </h3>
                  <address className="mt-3 space-y-1 not-italic leading-6 text-gray-600">
                    <p className="text-sm">{cinema.cinemaAddress}</p>
                    <p className="text-sm">
                      {cinema.cinemaPostalCode} {cinema.cinemaCity},{" "}
                      {cinema.cinemaCountry}
                    </p>
                  </address>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
