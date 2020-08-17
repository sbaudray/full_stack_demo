import resolvers from "./graphql.resolvers";
import typeDefs from "./graphql.types";
import { makeExecutableSchema } from "graphql-tools";

export default makeExecutableSchema({ typeDefs, resolvers });
