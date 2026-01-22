export default function MovieCard({ movie, setMovies }) {
  function handleRatingChange(e) {
    if (movie.isSaved) return;

    const value = e.target.value;
    setMovies(prev =>
      prev.map(m =>
        m.id === movie.id ? { ...m, userRating: value } : m
      )
    );
  }

  function handleReviewChange(e) {
    if (movie.isSaved) return;

    const value = e.target.value;
    setMovies(prev =>
      prev.map(m =>
        m.id === movie.id ? { ...m, userReview: value } : m
      )
    );
  }

  function handleSave() {
    setMovies(prev =>
      prev.map(m =>
        m.id === movie.id
          ? { ...m, isSaved: true }
          : m
      )
    );
  }

  return (
    <div className="card">
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
          alt={movie.title}
        />
      )}

      <h3>{movie.title}</h3>
      <p>TMDB Rating: {movie.vote_average}</p>

      <p className="label">Your Rating</p>
      <input
        type="number"
        min="0"
        max="10"
        value={movie.userRating}
        onChange={handleRatingChange}
        disabled={movie.isSaved}
      />

      <p className="label">Your Review</p>
      <textarea
        value={movie.userReview}
        onChange={handleReviewChange}
        disabled={movie.isSaved}
        placeholder="Write your review"
      />

      {!movie.isSaved ? (
        <button className="save-btn" onClick={handleSave}>
          ✓ Save
        </button>
      ) : (
        <p className="saved-text">Saved ✓</p>
      )}
    </div>
  );
}
