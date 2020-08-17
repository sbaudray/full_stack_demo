import { Collection, Db, ObjectId } from "mongodb";

let movies: Collection;

export function init(db: Db) {
  if (movies) return;

  movies = db.collection("movies");
}

export function tagMovie(obj: any) {
  obj.__type = "Movie";

  return obj;
}

export function cursorMovies() {
  return movies.find({});
}

export async function getMovie(id: string) {
  try {
    return await movies.findOne({ _id: new ObjectId(id) });
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

    return inserted;
  } catch (error) {
    throw error;
  }
}
