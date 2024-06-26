import React, { useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import backgroundVideo from "../assets/videos/background-video.mp4";
import { useGetMoviesQuery } from "../redux/api/movieApiSlice";
import { useGetCinemasQuery } from "../redux/api/cinemaApiSlice";
import LoaderFull from "../components/LoaderFull";
import queryString from "query-string";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cinema, state } = queryString.parse(location.search);

  const {
    data: cinemas,
    isError: cinemasError,
    isLoading: cinemasLoading,
  } = useGetCinemasQuery();
  const [selectedCinema, setSelectedCinema] = useState(cinema || "all");
  const [selectedState, setSelectedState] = useState(state || "all");

  useEffect(() => {
    if (cinemas && cinemas.length > 0 && selectedCinema === "all") {
      setSelectedCinema(cinemas[0].id.toString());
    }
  }, [cinemas, selectedCinema]);

  useEffect(() => {
    const params = {
      cinema: selectedCinema !== "all" ? selectedCinema : undefined,
      state: selectedState !== "all" ? selectedState : undefined,
    };

    navigate({
      pathname: location.pathname,
      search: queryString.stringify(params),
    });
  }, [selectedCinema, selectedState, navigate, location.pathname]);

  const {
    data: moviesResponse,
    isError: moviesError,
    isLoading: moviesLoading,
  } = useGetMoviesQuery({
    state: selectedState,
    categories: ["all"],
    cinemaId: selectedCinema !== "all" ? selectedCinema : undefined,
  });

  if (cinemasLoading || moviesLoading) return <LoaderFull />;
  if (cinemasError || moviesError) return <div>Error loading data</div>;

  const movies = moviesResponse?.movies ?? [];

  console.log("All movies:", movies);

  const activeMoviesAllDates = movies.filter(
    (movie) => movie.moviePublishingState === "active"
  );
  const premiereMoviesAllDates = movies.filter(
    (movie) => movie.moviePublishingState === "premiere"
  );

  console.log("All active movies:", activeMoviesAllDates);
  console.log("All premiere movies:", premiereMoviesAllDates);

  const getLastWednesday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceLastWednesday = (dayOfWeek + 4) % 7; // Calculate days since last Wednesday (Wednesday is 3 in JS Date)
    const lastWednesday = new Date(today);
    lastWednesday.setDate(today.getDate() - daysSinceLastWednesday);
    lastWednesday.setHours(0, 0, 0, 0); // Set to start of the day
    return lastWednesday;
  };

  const lastWednesday = getLastWednesday();

  const moviesAddedOnLastWednesday = movies.filter((movie) => {
    const movieDate = new Date(movie.createdAt);
    return (
      movieDate >= lastWednesday &&
      movieDate < new Date(lastWednesday.getTime() + 24 * 60 * 60 * 1000)
    );
  });

  console.log("Movies added on last Wednesday:", moviesAddedOnLastWednesday);

  const activeMovies = moviesAddedOnLastWednesday.filter(
    (movie) => movie.moviePublishingState === "active"
  );
  const premiereMovies = moviesAddedOnLastWednesday.filter(
    (movie) => movie.moviePublishingState === "premiere"
  );

  console.log("Active movies (last Wednesday):", activeMovies);
  console.log("Premiere movies (last Wednesday):", premiereMovies);

  const formatSessionDates = (sessions) => {
    if (!sessions || sessions.length === 0) return "Aucune séance disponible";
    const uniqueDates = [
      ...new Set(
        sessions.map((session) => {
          const sessionDate = new Date(
            session.timeRanges[0].timeRangeStartTime
          ); // Use the timeRangeStartTime to derive the session date
          if (isNaN(sessionDate)) {
            return "Invalid Date";
          }
          return sessionDate.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        })
      ),
    ];
    return uniqueDates.join(", ");
  };

  const faqs = [
    {
      question: "Comment puis-je réserver un billet de cinéma ?",
      answer:
        "Vous pouvez réserver un billet de cinéma en sélectionnant le film, l'heure de la séance et les sièges souhaités sur notre site web ou notre application mobile. Suivez les instructions pour compléter votre réservation.",
    },
    // ... (other FAQ entries)
  ];

  return (
    <div>
      <div className="relative w-full h-[80vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={backgroundVideo}
          autoPlay
          loop
          muted
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="text-white mb-4">
            <h1 className="text-2xl text-white font-bold mb-4">
              Le Joyau du Cinéma Français
            </h1>
            <Link to="/movies">
              <button className="px-6 py-2 bg-red-700 text-white font-semibold rounded hover:bg-red-800">
                Réserver une séance
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">En ce moment</h2>
          <div className="mb-4 flex space-x-4">
            {cinemas.map((cinema) => (
              <button
                key={cinema.id}
                defaultChecked={selectedCinema === cinema.id.toString()}
                onClick={() => setSelectedCinema(cinema.id.toString())}
                className={`px-4 py-2 rounded ${
                  selectedCinema === cinema.id.toString()
                    ? "border-gray-400 bg-gray-200 border-2"
                    : "bg-gray-100"
                }`}
              >
                {cinema.cinemaName}
              </button>
            ))}
          </div>
          {activeMovies.length === 0 ? (
            <>
              <p>Aucune nouveauté pour le moment.</p>
              <Link
                to="/movies"
                className="w-fit mt-4 block rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Voir tous les films
              </Link>
            </>
          ) : (
            <div className="border-t pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {activeMovies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="group"
                >
                  <div className="bg-gray-50 px-8 py-6 rounded-lg border border-gray-300">
                    <img
                      src={movie.movieImg}
                      alt={movie.movieTitle}
                      className="w-full object-cover rounded-lg mb-4"
                    />
                    {movie.movieFavorite && (
                      <span className="w-fit py-1.5 px-2 mb-2 inline-flex items-center font-semibold text-white rounded-md text-xs bg-red-700">
                        Coup de coeur
                      </span>
                    )}
                    <h3 className="text-base font-semibold text-gray-900">
                      {movie.movieTitle}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {movie.categories
                        .map((category) => category.categoryName)
                        .join(", ")}
                    </p>
                    {movie.sessions && movie.sessions.length > 0 && (
                      <p className="text-gray-500">
                        {`Prochaines séances : ${formatSessionDates(
                          movie.sessions
                        )}`}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Avant-premières</h2>
          <div className="mb-4 flex space-x-4">
            {cinemas.map((cinema) => (
              <button
                key={cinema.id}
                defaultChecked={selectedCinema === cinema.id.toString()}
                onClick={() => setSelectedCinema(cinema.id.toString())}
                className={`px-4 py-2 rounded ${
                  selectedCinema === cinema.id.toString()
                    ? "border-gray-400 bg-gray-200 border-2"
                    : "bg-gray-100"
                }`}
              >
                {cinema.cinemaName}
              </button>
            ))}
          </div>
          {premiereMovies.length === 0 ? (
            <>
              <p>Aucune nouvelle avant-première pour le moment.</p>
              <Link
                to="/movies"
                className="w-fit mt-4 block rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Voir tous les films
              </Link>
            </>
          ) : (
            <div className="border-t pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
              {premiereMovies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="group"
                >
                  <div className="bg-gray-50 px-8 py-6 rounded-lg border border-gray-300">
                    <img
                      src={movie.movieImg}
                      alt={movie.movieTitle}
                      className="w-full object-cover rounded-lg mb-4"
                    />
                    {movie.movieFavorite && (
                      <span className="w-fit py-1.5 px-2 mt-4 inline-flex items-center font-semibold text-white rounded-md text-xs bg-red-700">
                        Coup de coeur
                      </span>
                    )}
                    <h3 className="text-base font-semibold text-gray-900">
                      {movie.movieTitle}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {movie.categories
                        .map((category) => category.categoryName)
                        .join(", ")}
                    </p>
                    {movie.sessions && movie.sessions.length > 0 ? (
                      <p className="text-gray-500">
                        {`Prochaines séances : ${formatSessionDates(
                          movie.sessions
                        )}`}
                      </p>
                    ) : (
                      <p className="text-gray-500">Aucune séance disponible</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
              Frequently asked questions
            </h2>
            <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
              {faqs.map((faq) => (
                <Disclosure as="div" key={faq.question} className="pt-6">
                  {({ open }) => (
                    <>
                      <dt>
                        <DisclosureButton className="flex w-full items-start justify-between text-left text-gray-900">
                          <span className="text-base font-semibold leading-7">
                            {faq.question}
                          </span>
                          <span className="ml-6 flex h-7 items-center">
                            {open ? (
                              <MinusIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </DisclosureButton>
                      </dt>
                      <DisclosurePanel as="dd" className="mt-2 pr-12">
                        <p className="text-base leading-7 text-gray-600">
                          {faq.answer}
                        </p>
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
