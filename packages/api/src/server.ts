import express from "express";
import session from "express-session";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql.schema";
import cors from "cors";

const app = express();

app.use(
  session({
    secret: "tempsecret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 1440 * 7,
    },
  })
);

app.use(
  "/graphql",
  cors({
    origin: (_, cb) => cb(null, true),
    credentials: true,
  }),
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

export default app;
