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

      <p className="label">Your Rating</p>

      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => {
            if (movie.isSaved) return;
            setMovies(prev =>
              prev.map(m =>
                m.id === movie.id ? { ...m, userRating: star } : m
              )
            );
          }}
          style={{
            cursor: movie.isSaved ? "default" : "pointer",
            fontSize: "20px",
            color: star <= movie.userRating ? "gold" : "grey"
          }}
        >
          ★
        </span>
      ))}

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
