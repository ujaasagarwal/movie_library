import { useState, useEffect } from "react";
import Library from "./components/Library";
import AddMovieModal from "./components/AddMovieModal";

export default function App() {
  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem("movies");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const savedOnly = movies.filter(m => m.isSaved);
    localStorage.setItem("movies", JSON.stringify(savedOnly));
  }, [movies]);

  return (
    <>
      <Library
        movies={movies}
        setMovies={setMovies}
        openModal={() => setIsModalOpen(true)}
      />

      {isModalOpen && (
        <AddMovieModal
          movies={movies}
          setMovies={setMovies}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
