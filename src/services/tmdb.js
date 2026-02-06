const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function searchMovie(query, page = 1) {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}&language=en-US`
  );
  if (!res.ok) throw new Error("Movie search failed");
  return res.json();
}

export async function searchPerson(query) {
  const res = await fetch(
    `${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&language=en-US`
  );
  if (!res.ok) throw new Error("Person search failed");
  return res.json();
}

export async function getPersonMovies(personId) {
  const res = await fetch(
    `${BASE_URL}/person/${personId}/movie_credits?api_key=${API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error("Credits request failed");
  return res.json();
}

export async function discoverMovies({
  page = 1,
  genre,
  genreMode,
  year
}) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    page,
    sort_by: "popularity.desc"
  });

  if (genre) {
    genreMode === "exclude"
      ? params.append("without_genres", genre)
      : params.append("with_genres", genre);
  }

  if (year) {
    params.append("primary_release_year", year);
  }

  const res = await fetch(
    `${BASE_URL}/discover/movie?${params.toString()}`
  );

  if (!res.ok) throw new Error("Discover failed");
  return res.json();
}
