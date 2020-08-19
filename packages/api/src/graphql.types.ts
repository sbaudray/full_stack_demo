let { MovieConnection, MovieEdge, movies } = genConnection("Movie");

export default `
interface Node {
  id: ID!
}

interface Error {
  message: String!
}

type PageInfo {
  hasPreviousPage: Boolean!
  hasNextPage: Boolean!
  startCursor: String
  endCursor: String
}

type DuplicateUserError implements Error {
  message: String!
}

type User {
  id: ID!
  username: String!
  email: String!
}

type Movie implements Node { 
  id: ID!
  title: String!
  director: String!
} 

input CreateMovieInput {
  title: String!
  director: String!
}

type CreateMoviePayload {
  movie: Movie
}

${MovieConnection}

${MovieEdge}

input SignUpInput {
  username: String!
  email: String!
  password: String!
}

union SignUpPayload = SignUpSuccess | DuplicateUserError

type SignUpSuccess {
  user: User
}

type Query { 
  ${movies}
  node(id: ID!): Node
  cat: String
}

type Mutation {
  createMovie(input: CreateMovieInput!): CreateMoviePayload 
  signUp(input: SignUpInput!): SignUpPayload
}

schema {
  query: Query
  mutation: Mutation
}
`;

function lowerPlural(s: string) {
  return s.toLowerCase() + "s";
}

function genQuery(name: string) {
  return `
  ${lowerPlural(
    name
  )}(first: Int, before: String, last: Int, after: String): ${name}Connection
  `;
}

function genConnection(name: string) {
  let conn = `
  type ${name}Connection {
    edges: [${name}Edge]
    pageInfo: PageInfo!
  }
  `;

  let edge = `
  type ${name}Edge {
    cursor: String!
    node: ${name}
  }
  `;

  let query = genQuery(name);

  return {
    [`${name}Connection`]: conn,
    [`${name}Edge`]: edge,
    [`${lowerPlural(name)}`]: query,
  };
}
