import * as LibraryResolvers from "./library.resolvers";
import * as NodeResolvers from "./node.resolvers";
import { IResolvers } from "graphql-tools";
import { toGlobalId } from "graphql-relay";
import { GraphQLResolveInfo } from "graphql";

function globalId(
  parent: any,
  _args: any,
  _context: any,
  info: GraphQLResolveInfo
) {
  return toGlobalId(info.parentType.name, parent._id);
}

let resolvers: IResolvers = {
  Movie: {
    __isTypeOf: (obj: any) => obj.__type === "Movie",
    id: globalId,
  },
  Query: {
    movies: LibraryResolvers.movies,
    node: NodeResolvers.node,
  },
  Mutation: {
    createMovie: LibraryResolvers.createMovie,
  },
};

export default resolvers;
