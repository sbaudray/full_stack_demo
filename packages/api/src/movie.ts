import { ObjectId } from "bson";

export interface t {
  __typename: "Movie";
  id: string;
  actors: string;
  country: string;
  director: string;
  genres: string;
  imdbId: string;
  imdbRating: string;
  languages: string;
  plot: string;
  poster: string;
  released: string;
  runtime: string;
  title: string;
  writer: string;
  year: string;
}

type ToDb<T> = Omit<T, "id" | "__typename">;
type FromDb<T> = T & { _id: ObjectId };

export type toDb = ToDb<t>;

export type fromDb = FromDb<toDb>;

export function make(data: fromDb): t {
  let { _id, ...rest } = data;

  let id = _id.toHexString();

  return {
    id,
    __typename: "Movie",
    ...rest,
  };
}
