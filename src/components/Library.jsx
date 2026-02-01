import MovieCard from "./MovieCard";
import img1 from "../assets/image_1.jpg";
import img2 from "../assets/image_2.jpg";
import img3 from "../assets/img_3.jpg";
import img4 from "../assets/img_4.jpg";
import img5 from "../assets/img_5.png";

export default function Library({ movies, setMovies, openModal }) {
  return (
    <>
      <header className="header">
       <div className="hero-content">
          <h1>
            Movie Library
          </h1>

          <p>
            Keep track of your favorite movies, explore new titles,
            <br />
            and build your personal film collection.
          </p>

          <button className="hero-btn"
            onClick={() => document.getElementById("add-movie")
              .scrollIntoView({ behavior: "smooth" })} >
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
    </>
  );
}
