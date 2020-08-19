import { ObjectId } from "bson";

export interface t {
  __typename: "Movie";
  id: string;
  title: string;
  director: string;
}

type ToDb<T> = Omit<T, "id" | "__typename">;
type FromDb<T> = T & { _id: ObjectId };

export type toDb = ToDb<t>;

export type fromDb = FromDb<toDb>;

export function make(data: fromDb): t {
  let id = data._id.toHexString();
  delete data._id;

  return {
    id,
    __typename: "Movie",
    ...data,
  };
}

