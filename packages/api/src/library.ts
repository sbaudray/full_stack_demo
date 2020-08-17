import { Collection, Db, ObjectId } from "mongodb";
import * as Tagger from "./graphql.tagger";

let movies: Collection;

export function init(db: Db) {
  if (movies) return;

  movies = db.collection("movies");
}

export function cursorMovies() {
  return movies.find({});
}

export async function getMovie(id: string) {
  try {
    let movie = await movies.findOne({ _id: new ObjectId(id) });

    return Tagger.tagMovie(movie);
  } catch (error) {
    throw error;
  }
}

export async function createMovie(doc: { title: string; director: string }) {
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

    return Tagger.tagMovie(inserted);
  } catch (error) {
    throw error;
  }
}
