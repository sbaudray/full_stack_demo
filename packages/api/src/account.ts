import { Db, Collection } from "mongodb";
import * as User from "./account.user";

let users: Collection;

export function init(db: Db) {
  if (users) return;

  users = db.collection("users");
}

export async function createUser(user: User.toDb) {
  try {
    let {
      ops: [inserted],
    } = await users.insertOne(user);

    return User.make(inserted);
  } catch (error) {
    throw error;
  }
}

export async function signUp(data: User.toDb) {
  let user = await createUser(data);

  return user;
}
