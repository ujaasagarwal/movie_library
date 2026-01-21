
import { useState } from "react";
import Library from "./components/Library";
import AddMovieModal from "./components/AddMovieModal";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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