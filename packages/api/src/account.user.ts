import { ObjectId } from "bson";
import { toGlobalId } from "graphql-relay";

let __type = "User" as const;

export type t = {
  __type: typeof __type;
  id: string;
  email: string;
  username: string;
};

type ToDb<T> = Omit<T, "id" | "__type">;
type FromDb<T> = T & { _id: ObjectId };

export type toDb = ToDb<t>;

export type fromDb = FromDb<toDb>;

export function make(data: fromDb): t {
  let id = toGlobalId(__type, data._id.toHexString());
  delete data._id;

  return { id, __type, ...data };
}

export function is(obj: any) {
  return obj.__type === __type;
}
