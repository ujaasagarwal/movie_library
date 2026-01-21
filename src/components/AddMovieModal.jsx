import { useState, useRef } from "react";
import {
  searchMovie,
  searchPerson,
  getPersonMovies
} from "../services/tmdb";

function dedupeById(items) {
  if (!Array.isArray(items)) return [];
  const map = new Map();
  items.forEach(i => {
    if (!map.has(i.id)) map.set(i.id, i);
  });
  return Array.from(map.values());
}

export default function AddMovieModal({ movies, setMovies, closeModal }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("movie");
  const [results, setResults] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoOpenId, setInfoOpenId] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const requestIdRef = useRef(0);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    const currentId = ++requestIdRef.current;

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
        if (currentId !== requestIdRef.current) return;
        setResults(dedupeById(data?.results || []));
      } else {
        const data = await searchPerson(query);
        if (currentId !== requestIdRef.current) return;
        setPeople(
          (data?.results || []).filter(p =>
            filter === "actor"
              ? p.known_for_department === "Acting"
              : p.known_for_department === "Directing"
          )
        );
      }
    } catch {
      if (currentId === requestIdRef.current) {
        setError("Search failed");
      }
    } finally {
      if (currentId === requestIdRef.current) {
        setLoading(false);
        setHasSearched(true);
      }
    }
  }

  async function handlePersonSelect(person) {
    const currentId = ++requestIdRef.current;

    setLoading(true);
    setResults([]);
    setError("");
    setSelectedPerson(person);
    setInfoOpenId(null);
    setHasSearched(false);

    try {
      const credits = await getPersonMovies(person.id);
      if (currentId !== requestIdRef.current) return;

      const movies =
        filter === "actor"
          ? credits.cast || []
          : credits.crew?.filter(c => c.job === "Director") || [];

      setResults(dedupeById(movies));
    } catch {
      if (currentId === requestIdRef.current) {
        setError("Failed to load credits");
      }
    } finally {
      if (currentId === requestIdRef.current) {
        setLoading(false);
        setHasSearched(true);
      }
    }
  }

  function addMovie(movie) {
    if (movies.some(m => m.id === movie.id)) return;
    setMovies(prev => [
      ...prev,
      { ...movie, userRating: 0, userReview: "" }
    ]);
    closeModal();
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <button type="button" onClick={closeModal}>X</button>

        <form onSubmit={handleSearch}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search..."
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

        {loading && <p>Loading…</p>}
        {error && <p>{error}</p>}

        {hasSearched &&
          !loading &&
          filter === "movie" &&
          results.length === 0 &&
          !error && <p>No movies found</p>}

        {hasSearched &&
          !loading &&
          filter !== "movie" &&
          people.length === 0 &&
          !error && <p>No people found</p>}

        {!selectedPerson && people.map(p => (
          <div key={p.id} className="result">
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              onClick={() => handlePersonSelect(p)}
            >
              <span>{p.name}</span>
              <span
                onClick={e => {
                  e.stopPropagation();
                  setInfoOpenId(infoOpenId === p.id ? null : p.id);
                }}
              >
                ⓘ
              </span>
            </div>

            {infoOpenId === p.id && (
              <div className="info-box">
                <div>{p.known_for_department}</div>
                <div>{p.popularity}</div>
              </div>
            )}
          </div>
        ))}

        {results.map(m => (
          <div key={m.id} className="result">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{m.title}</span>
              <span
                onClick={e => {
                  e.stopPropagation();
                  setInfoOpenId(infoOpenId === m.id ? null : m.id);
                }}
              >
                ⓘ
              </span>
            </div>

            {infoOpenId === m.id && (
              <div className="info-box">
                <div>{m.release_date?.slice(0, 4) || "N/A"}</div>
                <div>{m.vote_average || "N/A"}</div>
                <div>{m.overview?.slice(0, 120) || "No description"}</div>
              </div>
            )}

            <button type="button" onClick={() => addMovie(m)}>
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}