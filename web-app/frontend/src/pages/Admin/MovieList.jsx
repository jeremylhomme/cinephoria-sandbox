import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LoaderFull from "../../components/LoaderFull";
import {
  PencilSquareIcon,
  TrashIcon,
  PhotoIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

import {
  useGetMoviesQuery,
  useDeleteMovieMutation,
} from "../../redux/api/movieApiSlice";

import { BASE_URL } from "../../redux/constants";

const MovieList = () => {
  const { data: movies, refetch, isLoading, error } = useGetMoviesQuery("all");

  const [deleteMovie] = useDeleteMovieMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        const movieId = Number(id);
        if (isNaN(movieId)) {
          toast.error("Invalid ID: Deletion not performed.");
          return;
        }
        await deleteMovie(movieId).unwrap();
        refetch();

        toast.success("Movie deleted successfully!");
      } catch (err) {
        toast.error(
          "An error occurred while deleting the movie. Please try again later."
        );
        console.error("Deletion error:", err);
      }
    }
  };

  const truncateByWords = (text, maxWords) => {
    const wordsArray = text.split(" ");
    if (wordsArray.length > maxWords) {
      return wordsArray.slice(0, maxWords).join(" ") + "...";
    }
    return text;
  };

  if (isLoading) return <LoaderFull />;
  if (error) return <p>Error loading movies: {error.message}</p>;

  return (
    <>
      <div className="pt-16 pb-24">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight">
              Films
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <p className="mt-2 text-sm text-gray-600">
                    Ajoutez, modifiez ou supprimez des films.
                  </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <Link
                    to="/admin/movielist/movieadd"
                    className="block rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Ajouter
                  </Link>
                </div>
              </div>
              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="bg-white inline-block min-w-full py-2 align-middle box-border border border-solid rounded-md border-[#e5e7eb] sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0"
                          >
                            ID
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0"
                          >
                            Image
                          </th>
                          <th
                            scope="col"
                            className="pr-3 py-3.5 text-left text-sm font-semibold"
                          >
                            Titre
                          </th>
                          <th
                            scope="col"
                            className="pr-3 py-3.5 text-left text-sm font-semibold"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="pr-3 py-3.5 text-left text-sm font-semibold"
                          >
                            Statut
                          </th>
                          <th
                            scope="col"
                            className="pr-3 py-3.5 text-left text-sm font-semibold"
                          >
                            ID de la séance
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                          >
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-transparent">
                        {movies && movies.length > 0 ? (
                          movies.map((movie) => (
                            <tr key={movie.id}>
                              <td className="whitespace-nowrap pr-3 py-5 text-sm">
                                {movie.id}
                              </td>
                              <td className="whitespace-nowrap pr-3 py-5 text-sm">
                                {movie.movieImg ? (
                                  <img
                                    className="inline-block h-10 w-10 rounded-md"
                                    src={movie.movieImg}
                                    alt={movie.movieTitle}
                                  />
                                ) : (
                                  <PhotoIcon
                                    className="h-7 w-7 text-gray-400"
                                    aria-hidden="true"
                                  />
                                )}
                              </td>

                              <td className="whitespace-nowrap pr-3 py-5 text-sm">
                                {movie.movieTitle}
                              </td>
                              <td className="whitespace-nowrap pr-3 py-5 text-sm">
                                {truncateByWords(movie.movieDescription, 8)}
                              </td>
                              <td className="whitespace-nowrap pr-3 py-5 text-sm">
                                {movie.moviePublishingState}
                              </td>
                              <td className="whitespace-nowrap pr-3 py-5 text-sm">
                                {movie.sessions && movie.sessions.length > 0
                                  ? movie.sessions[0].id
                                  : "No session"}
                              </td>
                              <td className="whitespace-nowrap px-3 py-8 text-sm flex items-center">
                                <Link
                                  to={`/admin/movielist/moviedetails/${movie.id}`}
                                  className="hover:text-gray-300 mr-4"
                                >
                                  <EyeIcon className="h-5 w-5" />
                                </Link>

                                <Link
                                  to={`/admin/movielist/movieupdate/${movie.id}`}
                                  className="hover:text-gray-300"
                                >
                                  <PencilSquareIcon className="h-5 w-5" />
                                </Link>
                                <button
                                  onClick={() => deleteHandler(movie.id)}
                                  className="ml-3 hover:text-gray-300"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="7"
                              className="whitespace-nowrap pr-3 py-5 text-sm text-center text-gray-500"
                            >
                              Aucun film trouvé.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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

export default MovieList;
