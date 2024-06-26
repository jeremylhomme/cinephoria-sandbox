import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetCinemasQuery } from "../../redux/api/cinemaApiSlice";
import { useGetMoviesQuery } from "../../redux/api/movieApiSlice";
import LoaderFull from "../../components/LoaderFull";
import { BASE_URL } from "../../redux/constants";
import queryString from "query-string";

const Movies = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cinema, categories, state } = queryString.parse(location.search);

  const {
    data: cinemas,
    isError: cinemasError,
    isLoading: cinemasLoading,
  } = useGetCinemasQuery();
  const [selectedCinema, setSelectedCinema] = useState(cinema || "");
  const [selectedCategories, setSelectedCategories] = useState(
    categories ? categories.split(",") : []
  );
  const [selectedState, setSelectedState] = useState(state || "all");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (cinemas && cinemas.length > 0 && !cinema) {
      setSelectedCinema(cinemas[0].id.toString());
    }
  }, [cinemas, cinema]);

  useEffect(() => {
    const params = {
      cinema: selectedCinema || undefined,
      categories:
        selectedCategories.length > 0
          ? selectedCategories.join(",")
          : undefined,
      state: selectedState || undefined,
    };

    navigate({
      pathname: location.pathname,
      search: queryString.stringify(params),
    });
  }, [
    selectedCinema,
    selectedCategories,
    selectedState,
    navigate,
    location.pathname,
  ]);

  const {
    data: moviesResponse,
    isError: moviesError,
    isLoading: moviesLoading,
  } = useGetMoviesQuery({
    state: selectedState,
    categories: selectedCategories.length > 0 ? selectedCategories : ["all"],
    cinemaId: selectedCinema !== "all" ? selectedCinema : undefined,
  });

  if (cinemasLoading || moviesLoading) return <LoaderFull />;
  if (cinemasError || moviesError) return <div>Error loading data</div>;

  const handleCinemaChange = (e) => {
    setSelectedCinema(e.target.value || "");
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((cat) => cat !== value)
    );
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  // Only use movies associated with the selected cinema
  const filteredMovies = moviesResponse?.movies ?? [];

  const categoriesList = Array.from(
    new Set(
      filteredMovies.flatMap((movie) =>
        movie.categories.map((cat) => JSON.stringify(cat))
      )
    )
  ).map((cat) => JSON.parse(cat));

  const movieStates = [
    { value: "all", label: "Tous" },
    { value: "active", label: "En ce moment" },
    { value: "premiere", label: "En avant première" },
  ];

  return (
    <div className="bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 bg-white p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Cinéma</h3>
            <div className="mt-2 space-y-2">
              {cinemas.map((cinema) => (
                <div key={cinema.id} className="flex items-center">
                  <input
                    id={`cinema-${cinema.id}`}
                    type="radio"
                    value={cinema.id}
                    checked={selectedCinema === cinema.id.toString()}
                    onChange={handleCinemaChange}
                    className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <label
                    htmlFor={`cinema-${cinema.id}`}
                    className="ml-3 text-sm text-gray-600"
                  >
                    {cinema.cinemaName}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Catégories</h3>
            <div className="mt-2 space-y-2">
              {categoriesList.map((category) => (
                <div key={category.categoryName} className="flex items-center">
                  <input
                    id={`category-${category.categoryName}`}
                    type="checkbox"
                    value={category.categoryName}
                    checked={selectedCategories.includes(category.categoryName)}
                    onChange={handleCategoryChange}
                    className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <label
                    htmlFor={`category-${category.categoryName}`}
                    className="ml-3 text-sm text-gray-600"
                  >
                    {category.categoryName}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">État</h3>
            <div className="mt-2 space-y-2">
              {movieStates.map((state) => (
                <div key={state.value} className="flex items-center">
                  <input
                    id={`state-${state.value}`}
                    type="radio"
                    value={state.value}
                    checked={selectedState === state.value}
                    onChange={handleStateChange}
                    className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <label
                    htmlFor={`state-${state.value}`}
                    className="ml-3 text-sm text-gray-600"
                  >
                    {state.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="pt-16 pb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Nos Films
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
              Découvrez les films actuellement en salle et à venir dans nos
              cinémas.
            </p>
          </div>

          {/* Mobile Filters Button */}
          <div className="lg:hidden p-4">
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="mb-4 px-4 py-2 text-white bg-green-700 rounded flex mx-auto"
            >
              {isMobileFiltersOpen
                ? "Masquer les filtres"
                : "Afficher les filtres"}
            </button>
            {isMobileFiltersOpen && (
              <div className="flex flex-col space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Cinéma</h3>
                  <div className="mt-2 space-y-2">
                    {cinemas.map((cinema) => (
                      <div key={cinema.id} className="flex items-center">
                        <input
                          id={`cinema-${cinema.id}`}
                          type="radio"
                          value={cinema.id}
                          checked={selectedCinema === cinema.id.toString()}
                          onChange={handleCinemaChange}
                          className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                        />
                        <label
                          htmlFor={`cinema-${cinema.id}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {cinema.cinemaName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Catégories
                  </h3>
                  <div className="mt-2 space-y-2">
                    {categoriesList.map((category) => (
                      <div
                        key={category.categoryName}
                        className="flex items-center"
                      >
                        <input
                          id={`category-${category.categoryName}`}
                          type="checkbox"
                          value={category.categoryName}
                          checked={selectedCategories.includes(
                            category.categoryName
                          )}
                          onChange={handleCategoryChange}
                          className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                        />
                        <label
                          htmlFor={`category-${category.categoryName}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {category.categoryName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">État</h3>
                  <div className="mt-2 space-y-2">
                    {movieStates.map((state) => (
                      <div key={state.value} className="flex items-center">
                        <input
                          id={`state-${state.value}`}
                          type="radio"
                          value={state.value}
                          checked={selectedState === state.value}
                          onChange={handleStateChange}
                          className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                        />
                        <label
                          htmlFor={`state-${state.value}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {state.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <section
            aria-labelledby="filter-heading"
            className="border-t border-gray-200 pt-6"
          >
            <h2 id="filter-heading" className="sr-only">
              Product filters
            </h2>
          </section>

          <section aria-labelledby="products-heading" className="mt-8">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>
            <div className="pb-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 xl:gap-x-8">
              {filteredMovies.map((movie) => (
                <Link
                  key={movie.id}
                  to={movie.sessions?.[0] ? `/movies/${movie.id}` : "#"}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={`${movie.movieImg}`}
                      alt={movie.movieTitle}
                      className="w-full h-auto object-cover group-hover:opacity-75"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>
                  {movie.movieFavorite && (
                    <span className="w-fit py-1 px-2 mt-4 inline-flex items-center font-semibold text-white rounded-md text-xs bg-red-700">
                      Coup de coeur
                    </span>
                  )}
                  <h3 className="mt-2 text-base font-medium text-gray-900">
                    {movie.movieTitle}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {movie.categories.map((cat) => cat.categoryName).join(", ")}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Movies;
