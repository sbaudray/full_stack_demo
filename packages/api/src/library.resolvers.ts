import * as Bookcase from "./library.bookcase";
import * as Library from "./library";
import { Request } from "express";
import { toGlobalId, fromGlobalId } from "graphql-relay";

export async function movies(_: any, args: any) {
  return await Library.moviesConnection(args);
}

export async function bookcases(
  _parent: any,
  _args: any,
  context: Request | undefined
) {
  if (!context?.session?.user) return null;

  return Library.getBookcasesByUserId({ userId: context.session.user.id });
}

export async function createMovie(_: any, { input }: any) {
  let movie = await Library.createMovie(input);

  return { movie };
}

export async function getBookcasesIdByUserId(
  _parent: any,
  _input: any,
  context: Request | undefined
) {
  let userId = context?.session?.user.id;

  if (!userId) return [];

  let bookcasesIds = await Library.getBookcasesIdsByUserId({ userId });

  return bookcasesIds.map((id) => toGlobalId("Bookcase", id));
}

export async function moviesConnectionFromBookcase(
  parent: Bookcase.t,
  args: any
) {
  return await Library.moviesConnectionFromBookcase(parent, args);
}

export async function addMovieToBookcase(_parent: any, { input }: any) {
  let { id: bookcaseId } = fromGlobalId(input.bookcaseId);

  let movie = await Library.addMovieToBookcase({
    movie: input.movie,
    bookcaseId,
  });

  return { movie };
}
