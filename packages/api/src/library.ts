import { Collection, ObjectId, MongoClient, ClientSession } from "mongodb";
// @ts-ignore
import connectionFromMongoCursor from "relay-mongodb-connection";
import * as Movie from "./movie";
import * as Bookcase from "./library.bookcase";
import { connectionArgs } from "graphql-relay";

let movies: Collection<Movie.fromDb>;
let bookcases: Collection<Bookcase.fromDb>;

export function init(client: MongoClient) {
  if (movies) return;

  movies = client.db(process.env.MONGO_DB_NAME).collection("movies");
  bookcases = client.db(process.env.MONGO_DB_NAME).collection("bookcases");
}

export async function createBookcase({
  name = "My Collection",
  userId,
  session,
}: {
  name?: string;
  userId: string;
  session?: ClientSession;
}) {
  try {
    let {
      ops: [inserted],
    } = await bookcases.insertOne(
      {
        movies: [],
        user_id: new ObjectId(userId),
        name,
      },
      { session }
    );

    return Bookcase.make(inserted);
  } catch (error) {
    throw error;
  }
}

export async function addMovieToBookcase({
  movie,
  bookcaseId,
}: {
  movie: Movie.toDb;
  bookcaseId: string;
}) {
  try {
    await upsertMovie(movie);

    let { result } = await bookcases.updateOne(
      { _id: new ObjectId(bookcaseId) },
      { $addToSet: { movies: movie.imdbId } }
    );

    return !!result.ok;
  } catch (error) {
    throw error;
  }
}

export async function getBookcasesIdsByUserId({ userId }: { userId: string }) {
  try {
    let result = await bookcases
      .find({ user_id: new ObjectId(userId) }, { projection: { _id: 1 } })
      .toArray();

    return result.map((bookcase) => bookcase._id.toHexString());
  } catch (error) {
    throw error;
  }
}

export async function getBookcasesByUserId({ userId }: { userId: string }) {
  try {
    let result = await bookcases
      .find({ user_id: new ObjectId(userId) })
      .toArray();

    return result.map(Bookcase.make);
  } catch (error) {
    throw error;
  }
}

export async function moviesConnectionFromBookcase(
  bookcase: Bookcase.t,
  args: typeof connectionArgs
) {
  let connection = await connectionFromMongoCursor(
    movies.find({ imdbId: { $in: bookcase.movies } }),
    args,
    Movie.make
  );

  return connection;
}

export async function moviesConnection(args: any) {
  try {
    let connection = await connectionFromMongoCursor(
      movies.find({}),
      args,
      Movie.make
    );

    return connection;
  } catch (error) {
    throw error;
  }
}

export async function getMovie(id: string) {
  try {
    let movie = await movies.findOne({ _id: new ObjectId(id) });

    if (!movie) return null;

    return Movie.make(movie);
  } catch (error) {
    throw error;
  }
}

export async function createMovie(doc: Movie.toDb) {
  try {
    let {
      ops: [inserted],
    } = await movies.insertOne(doc);

    return Movie.make(inserted);
  } catch (error) {
    throw error;
  }
}

export async function upsertMovie(movie: Movie.toDb) {
  try {
    let result = await movies.updateOne(
      { imdbId: movie.imdbId },
      { $setOnInsert: movie },
      {
        upsert: true,
      }
    );

    // upsertedId can be null
    return result.upsertedId?._id;
  } catch (error) {
    throw error;
  }
}
