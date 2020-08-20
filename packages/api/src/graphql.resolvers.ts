import * as LibraryResolvers from "./library.resolvers";
import * as AccountResolvers from "./account.resolvers";
import * as NodeResolvers from "./node.resolvers";
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
    cat: () => "cata",
  },
  Mutation: {
    createMovie: LibraryResolvers.createMovie,
    signUp: AccountResolvers.signUp,
    login: AccountResolvers.login,
  },
};

export default resolvers;
