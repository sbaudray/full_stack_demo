import * as Library from "./library";
import * as Movie from "./movie";

export async function movies(_: any, args: any) {
  return await Library.moviesConnection(args);
}

export async function createMovie(_: any, { input }: { input: Movie.toDb }) {
  let movie = await Library.createMovie(input);

  return { movie };
}
