import * as MovieSearch from "./movie_search";

export async function lookByTitle(_parent: any, { title }: { title: string }) {
  return await MovieSearch.lookByTitle(title);
}

export async function lookByImdbId(_parent: any, { id }: { id: string }) {
  return await MovieSearch.lookByImdbId(id);
}
