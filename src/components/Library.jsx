import MovieCard from "./MovieCard";

export default function Library({ movies, setMovies, openModal }) {
  return (
    <div className="container">
      <div className="wrapper">
      <header className="header">
        <h1>My Movie Library</h1>
        <p>Keep track of every movie you love.</p>
        <p>Track favorites, discover new gems, and revisit what you love.</p>
        <div className="mov"><b>YOUR MOVIES. YOUR LIBRARY</b></div>
        <button
            className="hero-btn"
            onClick={() =>
              document
                .getElementById("add-movie")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Enter Library
          </button>
      </header>
    </div>
    <div id="add-movie" className="add-movie">
      <section id="add">
        <h2>The <div className="realm">Realm</div> of movies is just a click away</h2>

        {movies.length === 0 && (
          <p className="pa">No movies yet. Add your first movie 🎬</p>
        )}

        <button onClick={openModal}>Add Movie</button>
      </section>
      

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
  </div>
  );
}