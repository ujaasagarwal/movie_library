import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

import img1 from "../assets/image_1.jpg";
import img2 from "../assets/image_2.jpg";
import img3 from "../assets/img_3.jpg";
import img4 from "../assets/img_4.jpg";
import img5 from "../assets/img_5.png";

const SORT_KEY = "library_sort_state";

export default function Library({ movies, setMovies, openModal }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [sortBy, setSortBy] = useState(() => {
    const saved = localStorage.getItem(SORT_KEY);
    return saved ? JSON.parse(saved).sortBy : "added";
  });

  const [sortDir, setSortDir] = useState(() => {
    const saved = localStorage.getItem(SORT_KEY);
    return saved ? JSON.parse(saved).sortDir : "desc";
  });

  useEffect(() => {
    localStorage.setItem(
      SORT_KEY,
      JSON.stringify({ sortBy, sortDir })
    );
  }, [sortBy, sortDir]);

  let visibleMovies = [...movies];

  if (searchTerm) {
    visibleMovies = visibleMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (genreFilter) {
    visibleMovies = visibleMovies.filter(movie =>
      movie.genre_ids?.includes(Number(genreFilter))
    );
  }

  if (yearFilter) {
    visibleMovies = visibleMovies.filter(movie =>
      movie.release_date?.startsWith(yearFilter)
    );
  }

  visibleMovies.sort((a, b) => {
    let valA;
    let valB;

    switch (sortBy) {
      case "name":
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
        break;

      case "release":
        valA = a.release_date || "";
        valB = b.release_date || "";
        break;

      case "imdb":
        valA = a.vote_average ?? -1;
        valB = b.vote_average ?? -1;
        break;

      case "user":
        valA = a.userRating ?? -1;
        valB = b.userRating ?? -1;
        break;

      case "added":
      default:
        valA = movies.indexOf(a);
        valB = movies.indexOf(b);
        break;
    }

    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;

    return a.title.localeCompare(b.title);
  });

  return (
    <>
      <header className="header">
        <div className="hero-content">
          <h1>Movie Library</h1>
          <p>
            Keep track of your favorite movies, explore new titles,
            <br />
            and build your personal film collection.
          </p>

          <button
            className="hero-btn"
            onClick={() =>
              document
                .getElementById("add-movie")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Collection
          </button>
        </div>

        <div className="poster-row">
          <img src={img1} />
          <img src={img2} className="active" />
          <img src={img3} />
          <img src={img4} />
          <img src={img5} />
        </div>
      </header>

      <div id="add-movie" className="add-movie">
        <section id="add">
          <h2>
            The <span className="realm">Realm</span> of movies is just a click away
          </h2>

          {movies.length === 0 && (
            <p className="pa">No movies yet. Add your first movie 🎬</p>
          )}

          <button className="hero-btn" onClick={openModal}>
            Add Movie
          </button>
        </section>

        {movies.length>0 && <div className="library-navbar">
          <div className="search-bar">
            <span className="search-icon">🔍</span>

            <input
              className="search-input"
              placeholder="Search your library…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            <div className="filter-wrapper">
              <button
                className="filter-btn"
                onClick={() => setShowSearch(s => !s)}
              >
                Filters ▾
              </button>

              {showSearch && (
                <div className="filter-dropdown">
                  <select
                    className="dropdown-input"
                    value={genreFilter}
                    onChange={e => setGenreFilter(e.target.value)}
                  >
                    <option value="">All Genres</option>
                    <option value="28">Action</option>
                    <option value="12">Adventure</option>
                    <option value="16">Animation</option>
                    <option value="35">Comedy</option>
                    <option value="18">Drama</option>
                    <option value="27">Horror</option>
                    <option value="10749">Romance</option>
                  </select>

                  <input
                    className="dropdown-input"
                    placeholder="Release year"
                    value={yearFilter}
                    onChange={e => setYearFilter(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="control-wrapper">
            <button
              className="control-btn"
              onClick={() => setShowSort(s => !s)}
            >
              Sort ▾
            </button>

            {showSort && (
              <div className="dropdown">
                <select
                  className="dropdown-input"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="added">When added</option>
                  <option value="name">Name</option>
                  <option value="release">Release Date</option>
                  <option value="imdb">IMDb Rating</option>
                  <option value="user">Your Rating</option>
                </select>

                <button
                  className="control-btn"
                  onClick={() =>
                    setSortDir(d => (d === "asc" ? "desc" : "asc"))
                  }
                >
                  {sortDir === "asc" ? "Ascending ↑" : "Descending ↓"}
                </button>
              </div>
            )}
          </div>
        </div>}

        <div className="grid">
          {visibleMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              setMovies={setMovies}
            />
          ))}
        </div>
      </div>
    </>
  );
}
