// always keep dotenv on top
import dotenv from "dotenv";
dotenv.config();
//
import { MongoClient } from "mongodb";
import * as Library from "./library";
import * as Account from "./account";
import app from "./server";

const port = process.env.port || 4000;

async function run() {
  let client = await MongoClient.connect(process.env.MONGO_DB_URI as string, {
    useNewUrlParser: true,
    wtimeout: 2500,
    useUnifiedTopology: true,
  });

  console.log("Connected to Mongo server");

  let database = client.db(process.env.MONGO_DB_NAME);

  Library.init(database);
  Account.init(database);

  app.listen(port);

  console.log(`Listening on port ${port}`);
}

run().catch(console.dir);
