import fetch from "node-fetch";

let key = process.env.OMDB_API_KEY;

export async function lookByTitle(title: string) {
  try {
    let url = `https://www.omdbapi.com/?apikey=${key}&s=${title}&type=movie`;

    let res = await fetch(url);

    let json = await res.json();

    let results = json.Search;

    return results.map((movie: any) => ({
      title: movie.Title,
      year: movie.Year,
      imdbId: movie.imdbID,
      poster: movie.Poster,
    }));
  } catch (error) {
    throw error;
  }
}

export async function lookByImdbId(id: string) {
  try {
    let url = `https://www.omdbapi.com/?apikey=${key}&i=${id}&type=movie`;

    let res = await fetch(url);

    let json = await res.json();

    return {
      actors: json.Actors,
      country: json.Country,
      director: json.Director,
      genres: json.Genre,
      imdbId: json.imdbID,
      imdbRating: json.imdbRating,
      languages: json.Language,
      plot: json.Plot,
      poster: json.Poster,
      released: json.Released,
      runtime: json.Runtime,
      title: json.Title,
      writer: json.Writer,
      year: json.Year,
    };
  } catch (error) {
    throw error;
  }
}
