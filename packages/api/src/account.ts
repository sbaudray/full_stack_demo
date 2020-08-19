import { Db, Collection } from "mongodb";
import * as User from "./account.user";
import argon2 from "argon2";

let users: Collection<User.fromDb>;

interface SignUpSuccess {
  __typename: "SignUpSuccess";
  user: User.t;
}

function SignUpSuccess(user: User.t): SignUpSuccess {
  return {
    __typename: "SignUpSuccess",
    user,
  };
}

interface Error<typename> {
  __typename: typename;
  message: string;
}

let DuplicateUserError: Error<"DuplicateUserError"> = {
  __typename: "DuplicateUserError",
  message: "An user already exists with this email",
};

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
    if (String(error).startsWith("MongoError: E11000 duplicate key error")) {
      return DuplicateUserError;
    }

    throw error;
  }
}

export async function signUp(data: User.toDb) {
  let passwordHash = await argon2.hash(data.password);

  let result = await createUser({ ...data, password: passwordHash });

  if (result.__typename === "DuplicateUserError") return result;

  return SignUpSuccess(result);
}
