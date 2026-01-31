import { useState, useRef } from "react";
import {
  searchMovie,
  searchPerson,
  getPersonMovies
} from "../services/tmdb";

function dedupeById(items) {
  if (!Array.isArray(items)) return [];
  const map = new Map();
  items.forEach(item => {
    if (!map.has(item.id)) map.set(item.id, item);
  });
  return Array.from(map.values());
}

export default function AddMovieModal({ movies, setMovies, closeModal }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("movie");
  const [results, setResults] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(false);``
  const [error, setError] = useState("");
  const [infoOpenId, setInfoOpenId] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const requestIdRef = useRef(0);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError("");
    setResults([]);
    setPeople([]);
    setSelectedPerson(null);
    setInfoOpenId(null);
    setHasSearched(false);

    try {
      if (filter === "movie") {
        const data = await searchMovie(query);
        if (requestId !== requestIdRef.current) return;
        setResults(dedupeById(data?.results || []));
      } else {
        const data = await searchPerson(query);
        if (requestId !== requestIdRef.current) return;
        setPeople(
          (data?.results || []).filter(p =>
            filter === "actor"
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
        setHasSearched(true);
      }
    }
  }

  async function handlePersonSelect(person) {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setResults([]);
    setError("");
    setSelectedPerson(person);
    setInfoOpenId(null);
    setHasSearched(false);

    try {
      const credits = await getPersonMovies(person.id);
      if (requestId !== requestIdRef.current) return;

      const movies =
        filter === "actor"
          ? credits.cast || []
          : credits.crew?.filter(c => c.job === "Director") || [];

      setResults(dedupeById(movies));
    } catch {
      if (requestId === requestIdRef.current) {
        setError("Failed to load credits");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setHasSearched(true);
      }
    }
  }

  function addMovie(movie) {
    if (movies.some(m => m.id === movie.id)) return;

    setMovies(prev => [
      ...prev,
      {
        ...movie,
        userRating: "",
        userReview: "",
        isSaved: false
      }
    ]);

    closeModal();
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <button type="button" onClick={closeModal}>✕</button>

        <form onSubmit={handleSearch}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search movies, actors, directors..."
          />

          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="movie">Movie</option>
            <option value="actor">Actor</option>
            <option value="director">Director</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {loading && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-result">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="skeleton skeleton-poster" />
                  <div className="skeleton skeleton-title" />
                </div>
                <div className="skeleton skeleton-btn" />
              </div>
            ))}
          </>
        )}

        {error && <p>{error}</p>}

        {hasSearched && !loading && filter === "movie" && results.length === 0 && !error && (
          <p>No movies found</p>
        )}

        {hasSearched && !loading && filter !== "movie" && people.length === 0 && !error && (
          <p>No people found</p>
        )}

        {!selectedPerson && people.map(person => (
          <div key={person.id} className="result">
            <span onClick={() => handlePersonSelect(person)}>
              {person.name}
            </span>
       
            <button
              type="button"
              onClick={() =>
                setInfoOpenId(infoOpenId === person.id ? null : person.id)
              }
            >
              Info
            </button>

            {infoOpenId === person.id && (
              <div className="person-info">
                {person.profile_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${person.profile_path}`}
                    alt={person.name}
                    className="person-photo"
                  />
                )}

                <p><strong>Name:</strong> {person.name}</p>
                <p><strong>Department:</strong> {person.known_for_department}</p>


              </div>
            )}
          </div>
        ))}


        {results.map(movie => (
          <div key={movie.id} className="result result-movie">
            <div className="result-left">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="result-poster"
                />
              )}
              <span>{movie.title}</span>
            </div>

            <button type="button" onClick={() => addMovie(movie)}>
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
