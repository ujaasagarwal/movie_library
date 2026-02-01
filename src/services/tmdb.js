const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
  
export async function searchMovie(query) {
  const url =
    `${BASE_URL}/search/movie` +
    `?api_key=${API_KEY}` +
    `&query=${encodeURIComponent(query)}` +
    `&language=en-US`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Movie search failed");
  return res.json();
}

export async function searchPerson(query) {
  const url =
    `${BASE_URL}/search/person` +
    `?api_key=${API_KEY}` +
    `&query=${encodeURIComponent(query)}` +
    `&language=en-US`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Person search failed");
  return res.json();
}

export async function getPersonMovies(personId) {
  const url =
    `${BASE_URL}/person/${personId}/movie_credits` +
    `?api_key=${API_KEY}` +
    `&language=en-US`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Credits request failed");
  return res.json();
}