import { Collection, Db } from "mongodb";

let movies: Collection;

export function init(db: Db) {
  if (movies) return;

  movies = db.collection("movies");
}

export async function top10() {
  try {
    return await movies.find({}).limit(10).toArray();
  } catch (error) {
    throw error;
  }
}

export async function create(doc: { title: string; director: string }) {
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
  let {
    ops: [insertedMovie],
  } = await movies.insertOne(doc);

  return { movie: insertedMovie };
}
