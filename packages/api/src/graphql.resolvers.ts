import * as LibraryResolvers from "./library.resolvers";
import * as NodeResolvers from "./node.resolvers";
import { IResolvers } from "graphql-tools";
import * as Movie from "./movie";

let resolvers: IResolvers = {
  Movie: {
    __isTypeOf: Movie.is,
  },
  Query: {
    movies: LibraryResolvers.movies,
    node: NodeResolvers.node,
    cat: () => "cata",
  },
  Mutation: {
    createMovie: LibraryResolvers.createMovie,
  },
};

export default resolvers;
