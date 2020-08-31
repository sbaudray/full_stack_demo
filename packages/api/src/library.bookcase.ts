import { ObjectId } from "bson";

export interface t {
  __typename: "Bookcase";
  id: string;
  userId: string;
  movies: string[];
  name: string;
}

export type fromDb = Omit<t, "id" | "__typename" | "userId"> & {
  _id: ObjectId;
  user_id: ObjectId;
};

export function make(data: fromDb): t {
  let { _id, user_id, ...rest } = data;

  let id = _id.toHexString();
  let userId = user_id.toHexString();

  return {
    __typename: "Bookcase",
    id,
    ...rest,
    userId,
  };
}
