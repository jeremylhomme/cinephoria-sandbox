import React from "react";
import { Link, useParams } from "react-router-dom";
import { PhotoIcon } from "@heroicons/react/24/outline";
import LoaderFull from "../../components/LoaderFull";
import { useGetMovieDetailsQuery } from "../../redux/api/movieApiSlice";
import { BASE_URL } from "../../redux/constants";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";

const formatDate = (dateString) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
};

const MovieDetails = () => {
  const { id } = useParams();
  const { data: movie, isFetching } = useGetMovieDetailsQuery(id);
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useGetCategoriesQuery();

  if (isFetching || isLoadingCategories) return <LoaderFull />;
  if (isErrorCategories) return <p>Error fetching categories.</p>;

  return (
    <main>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="my-12 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                {movie ? movie.movieTitle : "Movie Details"}
              </h1>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Link
                to="/admin/movielist"
                className="block rounded-md px-3 py-2 text-center text-sm font-semibold shadow-sm bg-gray-300 text-gray-600 hover:bg-gray-400"
              >
                Retour
              </Link>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="bg-white rounded-md inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="min-w-full divide-y divide-gray-300">
                  <div className="space-y-12">
                    <div>
                      <div className="mt-6">
                        <dl className="divide-y divide-gray-100">
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                              Movie Title
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {movie.movieTitle}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                              Description
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {movie.movieDescription}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                              Release Date
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {movie.movieReleaseDate
                                ? formatDate(movie.movieReleaseDate)
                                : "-"}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                              Length
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {movie.movieLength} minutes
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                              Minimum Age
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {movie.movieMinimumAge}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                              Trailer URL
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {movie.movieTrailerUrl ? (
                                <a
                                  href={movie.movieTrailerUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-indigo-600"
                                >
                                  {movie.movieTrailerUrl}
                                </a>
                              ) : (
                                "No trailer URL provided"
                              )}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                              Publishing State
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {movie.moviePublishingState}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                              Scheduled Date
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {movie.movieScheduleDate
                                ? formatDate(movie.movieScheduleDate)
                                : "-"}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                              Premiere Date
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {movie.moviePremiereDate
                                ? formatDate(movie.moviePremiereDate)
                                : "Aucune date d'avant-première n'est prévue"}
                            </dd>
                          </div>

                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                              Categories
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {movie.categories.map((category) => (
                                <span
                                  key={category.id}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2"
                                >
                                  {category.categoryName}
                                </span>
                              ))}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                              Movie Image
                            </dt>
                            <dd className="whitespace-nowrap pr-3 text-sm text-gray-500">
                              {movie.movieImg ? (
                                <img
                                  className="inline-block w-20 rounded-md"
                                  src={movie.movieImg}
                                  alt={movie.movieTitle}
                                />
                              ) : (
                                <PhotoIcon
                                  className="h-7 w-7 text-gray-400"
                                  aria-hidden="true"
                                />
                              )}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MovieDetails;
