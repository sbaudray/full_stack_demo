import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

let schema = buildSchema(`type Query { hello: String }`);

let root = {
  hello: () => "Hello world",
};

let app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000);

console.log("Listening");
