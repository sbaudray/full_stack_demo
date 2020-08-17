// @ts-ignore
import connectionFromMongoCursor from "relay-mongodb-connection";
import * as Library from "./library";

export function movies(_: any, args: any) {
  try {
    return connectionFromMongoCursor(
      Library.cursorMovies(),
      args,
      Library.tagMovie
    );
  } catch (error) {
    throw error;
  }
}

export function createMovie(
  _: any,
  { input }: { input: { title: string; director: string } }
) {
  let movie = Library.createMovie(input);

  return { movie };
}
