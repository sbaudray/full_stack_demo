import { Db, Collection } from "mongodb";
import * as User from "./account.user";
import argon2 from "argon2";

let users: Collection<User.fromDb>;

interface ResultError<typename> {
  __typename: typename;
  message: string;
}

let DuplicateUser: ResultError<"DuplicateUser"> = {
  __typename: "DuplicateUser",
  message: "An user already exists with this email",
};

let InvalidCredentials: ResultError<"InvalidCredentials"> = {
  __typename: "InvalidCredentials",
  message: "Invalid Credentials",
};

export let NotAuthenticated: ResultError<"NotAuthenticated"> = {
  __typename: "NotAuthenticated",
  message: "User is not authenticated",
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
      return DuplicateUser;
    }

    throw error;
  }
}

export function getUserByEmail(email: string) {
  return users.findOne({ email });
}

export async function signUp(data: User.toDb) {
  let passwordHash = await argon2.hash(data.password);

  let result = await createUser({ ...data, password: passwordHash });

  if (result.__typename === "DuplicateUser")
    return { user: null, resultErrors: [result] };

  return { user: result, resultErrors: [] };
}

export async function login(data: User.toDb) {
  try {
    let user = await getUserByEmail(data.email);

    if (!user) {
      throw InvalidCredentials;
    }

    let passwordMatch = await argon2.verify(user.password, data.password);

    if (!passwordMatch) {
      throw InvalidCredentials;
    }

    return { user: User.make(user), resultErrors: [] };
  } catch (error) {
    if (error.__typename === "InvalidCredentials") {
      return { user: null, resultErrors: [InvalidCredentials] };
    }

    throw error;
  }
}
