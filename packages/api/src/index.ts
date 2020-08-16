import express from "express";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { MongoClient } from "mongodb";
import * as MoviesDAO from "./movies.dao";
import dotenv from "dotenv";
import { IResolvers } from "graphql-tools";
import cors from "cors";

dotenv.config();

const typeDefs = `
type Movie { 
  _id: ID!
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

type Query { 
  top10: [Movie]
}

type Mutation {
  createMovie(input: CreateMovieInput!): CreateMoviePayload 
}

schema {
  query: Query
  mutation: Mutation
}
`;

const resolvers: IResolvers = {
  Query: {
    top10: () => {
      return MoviesDAO.top10();
    },
  },
  Mutation: {
    createMovie: (_parent, { input }, _context) => {
      return MoviesDAO.create(input);
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

app.use(
  "/graphql",
  cors(),
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const port = process.env.port || 4000;

async function run() {
  let client = await MongoClient.connect(process.env.MONGO_DB_URI as string, {
    useNewUrlParser: true,
    wtimeout: 2500,
    useUnifiedTopology: true,
  });

  console.log("Connected to Mongo server");

  let database = client.db(process.env.MONGO_DB_NAME);

  MoviesDAO.init(database);

  app.listen(port);

  console.log(`Listening on port ${port}`);
}

run().catch(console.dir);
