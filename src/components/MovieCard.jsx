export default function MovieCard({ movie, setMovies }) {
  function handleRatingChange(e) {
    const value = e.target.value;

    setMovies(prev =>
      prev.map(m =>
        m.id === movie.id ? { ...m, userRating: value } : m
      )
    );
  }

  function handleReviewChange(e) {
    const value = e.target.value;

    setMovies(prev =>
      prev.map(m =>
        m.id === movie.id ? { ...m, userReview: value } : m
      )
    );
  }

  return (
    <div className="card">
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
        />
      )}

      <h3>{movie.title}</h3>
      <p>TMDB Rating: {movie.vote_average}</p>

      <p className="label">Your Rating(1 to 10)</p>
      <input
        type="number"
        min="0"
        max="10"
        value={movie.userRating}
        onChange={handleRatingChange}
      />

      <p className="label">Your Review</p>
      <textarea
        value={movie.userReview || ""}
        onChange={handleReviewChange}
        placeholder="Reviews"
      />
    </div>
  );
}