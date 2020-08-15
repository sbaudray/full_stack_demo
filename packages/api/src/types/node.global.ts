import { Db, MongoClient } from "mongodb";

export interface Global extends NodeJS.Global {
  database: Db;
  mongoClient: MongoClient;
}

export default Global;
