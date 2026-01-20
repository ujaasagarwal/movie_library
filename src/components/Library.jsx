import MovieCard from "./MovieCard";

export default function Library({ movies, setMovies, openModal }) {
  return (
    <div className="container">
      <h1>My Movie Library</h1>

      <button onClick={openModal}>Add Movie</button>

      {movies.length === 0 && (
        <p>No movies yet. Add your first movie 🎬</p>
      )}

      <div className="grid">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            setMovies={setMovies}
          />
        ))}
      </div>
    </div>
  );
}
