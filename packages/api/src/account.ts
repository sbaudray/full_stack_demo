import { Collection, MongoClient, ClientSession } from "mongodb";
import * as User from "./account.user";
import * as Library from "./library";
import argon2 from "argon2";

let users: Collection<User.fromDb>;
let mongoClient: MongoClient;

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

export function init(client: MongoClient) {
  if (users) return;

  mongoClient = client;
  users = client.db(process.env.MONGO_DB_NAME).collection("users");
}

export async function createUser({
  user,
  session,
}: {
  user: User.toDb;
  session?: ClientSession;
}) {
  try {
    let {
      ops: [inserted],
    } = await users.insertOne(user, { session });

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

  let session = mongoClient.startSession();

  try {
    let result = await createUser({
      user: {
        ...data,
        password: passwordHash,
      },
      session,
    });

    if (result.__typename === "DuplicateUser") {
      return { user: null, resultErrors: [result] };
    }

    await Library.createBookcase({ userId: result.id, session });

    return { user: result, resultErrors: [] };
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
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
