import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import typeDefs from "./graphql.types";
import resolvers from "./graphql.resolvers";
import { makeExecutableSchema } from "graphql-tools";

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

export default app;
