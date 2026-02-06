import { useState, useRef } from "react";
import {
  searchMovie,
  searchPerson,
  getPersonMovies,
  discoverMovies
} from "../services/tmdb";

function dedupeById(items = []) {
  const map = new Map();
  items.forEach(item => map.set(item.id, item));
  return Array.from(map.values());
}

function applyFilters(movies, { genre, genreMode, year, yearMode }) {
  return movies.filter(movie => {
    let genreOk = true;
    let yearOk = true;

    if (genre) {
      const hasGenre = movie.genre_ids?.includes(Number(genre));
      genreOk = genreMode === "include" ? hasGenre : !hasGenre;
    }

    if (year && movie.release_date) {
      const movieYear = movie.release_date.split("-")[0];
      const match = movieYear === year;
      yearOk = yearMode === "include" ? match : !match;
    }

    return genreOk && yearOk;
  });
}

export default function AddMovieModal({ movies, setMovies, closeModal }) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("movie");

  const [results, setResults] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [genre, setGenre] = useState("");
  const [genreMode, setGenreMode] = useState("include");
  const [year, setYear] = useState("");
  const [yearMode, setYearMode] = useState("include");

  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pageRef = useRef(1);
  const requestIdRef = useRef(0);

  async function handleSearch(e) {
    e.preventDefault();
    setError("");
    setResults([]);
    setPeople([]);
    setSelectedPerson(null);

    const requestId = ++requestIdRef.current;
    pageRef.current = 1;
    setLoading(true);

    try {
      if (searchType === "movie") {
        const data = query.trim()
          ? await searchMovie(query, 1)
          : await discoverMovies({ genre, genreMode, year, page: 1 });

        if (requestId !== requestIdRef.current) return;

        setResults(
          applyFilters(
            dedupeById(data?.results || []),
            { genre, genreMode, year, yearMode }
          )
        );
      } else {
        if (!query.trim()) {
          setError("Enter a name to search");
          setLoading(false);
          return;
        }

        const data = await searchPerson(query);
        if (requestId !== requestIdRef.current) return;

        setPeople(
          (data?.results || []).filter(p =>
            searchType === "actor"
              ? p.known_for_department === "Acting"
              : p.known_for_department === "Directing"
          )
        );
      }
    } catch {
      if (requestId === requestIdRef.current) {
        setError("Search failed");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }

  async function handlePersonSelect(person) {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setResults([]);
    setSelectedPerson(person);

    try {
      const credits = await getPersonMovies(person.id);
      if (requestId !== requestIdRef.current) return;

      const movies =
        searchType === "actor"
          ? credits.cast || []
          : credits.crew?.filter(c => c.job === "Director") || [];

      setResults(
        applyFilters(
          dedupeById(movies),
          { genre, genreMode, year, yearMode }
        )
      );
    } catch {
      setError("Failed to load movies");
    } finally {
      setLoading(false);
    }
  }

  function addMovie(movie) {
    if (movies.some(m => m.id === movie.id)) return;
    setMovies(prev => [
      ...prev,
      { ...movie, userRating: "", userReview: "", isSaved: false }
    ]);
    closeModal();
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={closeModal}>✕</button>

        <form onSubmit={handleSearch}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={
              searchType === "movie"
                ? "Search movies (optional)"
                : "Search by name"
            }
          />

          <select
            value={searchType}
            onChange={e => {
              setSearchType(e.target.value);
              setResults([]);
              setPeople([]);
              setSelectedPerson(null);
            }}
          >
            <option value="movie">Movie</option>
            <option value="actor">Actor</option>
            <option value="director">Director</option>
          </select>

          {searchType === "movie" && (
            <button
              type="button"
              className="filter-btn"
              onClick={() => setShowFilters(f => !f)}
            >
              Filters ▾
            </button>
          )}

          {showFilters && (
            <div className="filter-box">
              <div>
                <select value={genreMode} onChange={e => setGenreMode(e.target.value)}>
                  <option value="include">Include</option>
                  <option value="exclude">Exclude</option>
                </select>

                <select value={genre} onChange={e => setGenre(e.target.value)}>
                  <option value="">Any Genre</option>
                  <option value="28">Action</option>
                  <option value="12">Adventure</option>
                  <option value="16">Animation</option>
                  <option value="35">Comedy</option>
                  <option value="18">Drama</option>
                  <option value="27">Horror</option>
                  <option value="10749">Romance</option>
                </select>
              </div>

              <div>
                <select value={yearMode} onChange={e => setYearMode(e.target.value)}>
                  <option value="include">Include</option>
                  <option value="exclude">Exclude</option>
                </select>

                <input
                  placeholder="Year (YYYY)"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {loading && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-result">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div className="skeleton skeleton-poster" />
                  <div className="skeleton skeleton-title" />
                </div>
                <div className="skeleton skeleton-btn" />
              </div>
            ))}
          </>
        )}

        {error && <p>{error}</p>}

        {!selectedPerson &&
          people.map(person => (
            <div key={person.id} className="result result-movie">
              <div className="result-left">
                {person.profile_path && (
                  <img
                    className="result-poster"
                    src={`https://image.tmdb.org/t/p/w92${person.profile_path}`}
                    alt={person.name}
                  />
                )}
                <span>{person.name}</span>
              </div>

              <button onClick={() => handlePersonSelect(person)}>
                View Movies
              </button>
            </div>
          ))}

        {results.map(movie => (
          <div key={movie.id} className="result result-movie">
            <div className="result-left">
              {movie.poster_path ? (
                <img
                  className="result-poster"
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="poster-placeholder small" />
              )}
              <span>{movie.title}</span>
            </div>

            <button onClick={() => addMovie(movie)}>Add</button>
          </div>
        ))}
      </div>
    </div>
  );
}
