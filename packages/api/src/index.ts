import express from "express";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { MongoClient } from "mongodb";
import * as MoviesDAO from "./movies.dao";

const uri =
  "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.qrbn6.mongodb.net?retryWrites=true";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  wtimeout: 2500,
});

const typeDefs = `
type Movie { 
  title: String
} 

type Query { 
  hello: [Movie]
}

schema {
  query: Query
}
`;

const resolvers = {
  Query: {
    hello: async () => {
      return await MoviesDAO.top10();
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const port = process.env.port || 4000;

async function run() {
  await client.connect();

  console.log("Connected to Mongo server");

  MoviesDAO.init(client);

  app.listen(port);

  console.log(`Listening on port ${port}`);
}

run().catch(console.dir);
