export default function MovieCard({ movie, setMovies }) {

  function handleDelete() {
    setMovies(prev => prev.filter(m => m.id !== movie.id));
  }

  function handleEdit() {
    setMovies(prev =>
      prev.map(m =>
        m.id === movie.id ? { ...m, isSaved: false } : m
      )
    );
  }
  function handleRatingChange(e) {
  if (movie.isSaved) return;

  const value = e.target.value;
  if (value === "" || /^(10|[1-9])$/.test(value)) {
    setMovies(prev =>
      prev.map(m =>
        m.id === movie.id ? { ...m, userRating: value } : m
      )
    );
  }
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
        m.id === movie.id ? { ...m, isSaved: true } : m
      )
    );
  }

  return (
    <div className="card">
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
          alt={movie.title}
        />
      ) : (
        <div className="poster-placeholder">No Poster</div>
      )}

      <h3>{movie.title}</h3>
      <p>TMDB Rating: {movie.vote_average ?? "N/A"}</p>
<p className="label">Your Rating (1–10)</p>

{movie.isSaved ? (
  <p>{movie.userRating || "No rating"}</p>
) : (
  <input
    type="text"
    value={movie.userRating || ""}
    onChange={handleRatingChange}
    placeholder="1–10"
    maxLength={2}
  />
)}


      <p className="label">Your Review</p>

      {movie.isSaved ? (
        <p className="review-text">
          {movie.userReview || "No review given"}
        </p>
      ) : (
        <textarea
          value={movie.userReview}
          onChange={handleReviewChange}
          placeholder="Write your review"
        />
      )}

      {!movie.isSaved ? (
        <button className="save-btn" onClick={handleSave}>✓ Save</button>
      ) : (
        <>
          <p className="saved-text">Saved ✓</p>
          <button className="save-btn" onClick={handleEdit}>Edit</button>
          <button className="save-btn" onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
}
