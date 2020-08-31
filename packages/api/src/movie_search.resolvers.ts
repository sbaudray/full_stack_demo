import * as MovieSearch from "./movie_search";

export async function lookByTitle(_parent: any, { title }: any) {
  return await MovieSearch.lookByTitle(title);
}

export async function lookByImdbId(_parent: any, { id }: any) {
  return await MovieSearch.lookByImdbId(id);
}
