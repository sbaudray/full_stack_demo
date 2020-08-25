import * as LibraryResolvers from "./library.resolvers";
import * as AccountResolvers from "./account.resolvers";
import * as NodeResolvers from "./node.resolvers";
import * as MovieSearchResolvers from "./movie_search.resolvers";
import { IResolvers } from "graphql-tools";
import { globalIdField } from "graphql-relay";

let resolvers: IResolvers = {
  Movie: {
    id: globalIdField(),
  },
  User: {
    id: globalIdField(),
  },
  Query: {
    movies: LibraryResolvers.movies,
    node: NodeResolvers.node,
    me: AccountResolvers.me,
    searchMovieByTitle: MovieSearchResolvers.lookByTitle,
    searchMovieByImdbId: MovieSearchResolvers.lookByImdbId,
  },
  Mutation: {
    createMovie: LibraryResolvers.createMovie,
    signUp: AccountResolvers.signUp,
    login: AccountResolvers.login,
  },
};

export default resolvers;
