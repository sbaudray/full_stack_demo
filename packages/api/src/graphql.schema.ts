import * as AccountResolvers from "./account.resolvers";
import * as LibraryResolvers from "./library.resolvers";
import * as MovieSearchResolvers from "./movie_search.resolvers";
import * as NodeResolvers from "./node.resolvers";

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLBoolean,
} from "graphql";
import {
  globalIdField,
  connectionArgs,
  connectionDefinitions,
} from "graphql-relay";

let nodeInterface = new GraphQLInterfaceType({
  name: "Node",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

let resultErrorInterface = new GraphQLInterfaceType({
  name: "ResultError",
  fields: () => ({
    message: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

let userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: globalIdField(),
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    bookcases: {
      type: new GraphQLNonNull(GraphQLList(new GraphQLNonNull(GraphQLID))),
      resolve: LibraryResolvers.getBookcasesIdByUserId,
    },
  }),
});

let movieType = new GraphQLObjectType({
  name: "Movie",
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    actors: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    director: { type: new GraphQLNonNull(GraphQLString) },
    genres: { type: new GraphQLNonNull(GraphQLString) },
    imdbId: { type: new GraphQLNonNull(GraphQLString) },
    imdbRating: { type: new GraphQLNonNull(GraphQLString) },
    languages: { type: new GraphQLNonNull(GraphQLString) },
    plot: { type: new GraphQLNonNull(GraphQLString) },
    poster: { type: new GraphQLNonNull(GraphQLString) },
    released: { type: new GraphQLNonNull(GraphQLString) },
    runtime: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    writer: { type: new GraphQLNonNull(GraphQLString) },
    year: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

let { connectionType: movieConnection } = connectionDefinitions({
  nodeType: movieType,
});

let movieInput = new GraphQLInputObjectType({
  name: "MovieInput",
  fields: () => ({
    actors: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    director: { type: new GraphQLNonNull(GraphQLString) },
    genres: { type: new GraphQLNonNull(GraphQLString) },
    imdbId: { type: new GraphQLNonNull(GraphQLString) },
    imdbRating: { type: new GraphQLNonNull(GraphQLString) },
    languages: { type: new GraphQLNonNull(GraphQLString) },
    plot: { type: new GraphQLNonNull(GraphQLString) },
    poster: { type: new GraphQLNonNull(GraphQLString) },
    released: { type: new GraphQLNonNull(GraphQLString) },
    runtime: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    writer: { type: new GraphQLNonNull(GraphQLString) },
    year: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

let movieByTitleSearchResultType = new GraphQLObjectType({
  name: "MovieByTitleSearchResult",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    year: { type: new GraphQLNonNull(GraphQLString) },
    imdbId: { type: new GraphQLNonNull(GraphQLString) },
    poster: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

let movieByImdbIdSearchResultType = new GraphQLObjectType({
  name: "MovieByImdbIdSearchResult",
  fields: () => ({
    actors: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    director: { type: new GraphQLNonNull(GraphQLString) },
    genres: { type: new GraphQLNonNull(GraphQLString) },
    imdbId: { type: new GraphQLNonNull(GraphQLString) },
    imdbRating: { type: new GraphQLNonNull(GraphQLString) },
    languages: { type: new GraphQLNonNull(GraphQLString) },
    plot: { type: new GraphQLNonNull(GraphQLString) },
    poster: { type: new GraphQLNonNull(GraphQLString) },
    released: { type: new GraphQLNonNull(GraphQLString) },
    runtime: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    writer: { type: new GraphQLNonNull(GraphQLString) },
    year: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

let bookcaseType = new GraphQLObjectType({
  name: "Bookcase",
  fields: () => ({
    id: globalIdField(),
    name: { type: new GraphQLNonNull(GraphQLString) },
    movies: {
      type: movieConnection,
      args: connectionArgs,
      resolve: LibraryResolvers.moviesConnectionFromBookcase,
    },
  }),
});

let invalidCredentialsType = new GraphQLObjectType({
  name: "InvalidCredentials",
  interfaces: [resultErrorInterface],
  fields: () => ({
    message: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

let duplicateUserType = new GraphQLObjectType({
  name: "DuplicateUser",
  interfaces: [resultErrorInterface],
  fields: () => ({
    message: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

let notAuthenticatedType = new GraphQLObjectType({
  name: "NotAuthenticated",
  interfaces: [resultErrorInterface],
  fields: () => ({
    message: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

let loginMutationInput = new GraphQLInputObjectType({
  name: "LoginInput",
  fields: () => ({
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

let loginMutationOutpout = new GraphQLObjectType({
  name: "LoginPayload",
  fields: () => ({
    user: { type: userType },
    resultErrors: {
      type: new GraphQLNonNull(
        GraphQLList(new GraphQLNonNull(invalidCredentialsType))
      ),
    },
  }),
});

let loginMutation = {
  type: loginMutationOutpout,
  args: {
    input: { type: new GraphQLNonNull(loginMutationInput) },
  },
  resolve: AccountResolvers.login,
};

let signUpMutationInput = new GraphQLInputObjectType({
  name: "SignUpInput",
  fields: () => ({
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

let signUpMutationOutput = new GraphQLObjectType({
  name: "SignUpPayload",
  fields: () => ({
    user: { type: userType },
    resultErrors: {
      type: new GraphQLNonNull(
        GraphQLList(new GraphQLNonNull(duplicateUserType))
      ),
    },
  }),
});

let signUpMutation = {
  type: signUpMutationOutput,
  args: {
    input: { type: new GraphQLNonNull(signUpMutationInput) },
  },
  resolve: AccountResolvers.signUp,
};

let addMovieToBookcaseMutationOutput = new GraphQLObjectType({
  name: "AddMovieToBookcasePayload",
  fields: () => ({
    movie: { type: movieType },
  }),
});

let addMovieToBookcaseMutationInput = new GraphQLInputObjectType({
  name: "AddMovieToBookcaseInput",
  fields: () => ({
    movie: { type: new GraphQLNonNull(movieInput) },
    bookcaseId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

let addMovieToBookcaseMutation = {
  type: addMovieToBookcaseMutationOutput,
  args: {
    input: {
      type: new GraphQLNonNull(addMovieToBookcaseMutationInput),
    },
  },
  resolve: LibraryResolvers.addMovieToBookcase,
};

let meOutput = new GraphQLObjectType({
  name: "MePayload",
  fields: () => ({
    user: { type: userType },
    resultErrors: {
      type: new GraphQLNonNull(
        GraphQLList(new GraphQLNonNull(notAuthenticatedType))
      ),
    },
  }),
});

let logoutMutationOutpout = new GraphQLObjectType({
  name: "LogoutPayload",
  fields: () => ({
    ok: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

let logoutMutation = {
  type: logoutMutationOutpout,
  resolve: AccountResolvers.logout,
};

let mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    login: loginMutation,
    logout: logoutMutation,
    signUp: signUpMutation,
    addMovieToBookcase: addMovieToBookcaseMutation,
  }),
});

let queryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    node: {
      type: nodeInterface,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: NodeResolvers.node,
    },
    me: {
      type: meOutput,
      resolve: AccountResolvers.me,
    },
    movies: {
      type: movieConnection,
      args: connectionArgs,
      resolve: LibraryResolvers.movies,
    },
    bookcases: {
      type: GraphQLList(bookcaseType),
      resolve: LibraryResolvers.bookcases,
    },
    searchMovieByTitle: {
      type: GraphQLList(new GraphQLNonNull(movieByTitleSearchResultType)),
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: MovieSearchResolvers.lookByTitle,
    },
    searchMovieByImdbId: {
      type: movieByImdbIdSearchResultType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: MovieSearchResolvers.lookByImdbId,
    },
    hello: {
      type: GraphQLString,
      resolve: () => "hello",
    },
  }),
});

export default new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
