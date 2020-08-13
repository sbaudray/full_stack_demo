import { MongoClient, Collection } from "mongodb";

let movies: Collection;

export async function init(client: MongoClient) {
  if (movies) return;

  movies = client.db("sample_mflix").collection("movies");
}

export async function top10() {
  return await movies.find({}).limit(10).toArray();
}
