import { Collection, Db, ObjectId } from "mongodb";
// @ts-ignore
import connectionFromMongoCursor from "relay-mongodb-connection";
import * as Movie from "./movie";

let movies: Collection<Movie.fromDb>;

export function init(db: Db) {
  if (movies) return;

  movies = db.collection("movies");
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
  // plot;
  // genres;
  // runtime;
  // cast;
  // num_mflix_comments;
  // fullplot;
  // countries;
  // released;
  // directors;
  // rated;
  // awards;
  // lastupdated;
  // year;
  // imdbId;
  try {
    let {
      ops: [inserted],
    } = await movies.insertOne(doc);

    return Movie.make(inserted);
  } catch (error) {
    throw error;
  }
}
