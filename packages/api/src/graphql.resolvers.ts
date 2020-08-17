import * as LibraryResolvers from "./library.resolvers";
import * as NodeResolvers from "./node.resolvers";
import { IResolvers } from "graphql-tools";

let resolvers: IResolvers = {
  Movie: {
    __isTypeOf: (obj: any) => obj.__type === "Movie",
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
