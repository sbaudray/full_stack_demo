const MongoClient = require("mongodb").MongoClient;
const NodeEnvironment = require("jest-environment-node");

require("dotenv").config();

const uri = process.env.MONGO_DB_URI;

module.exports = class MongoEnvironment extends NodeEnvironment {
  async setup() {
    if (!this.global.mongoClient && !this.global.database) {
      let client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        wtimeout: 2500,
      });

      let db = client.db("demo_test");

      this.global.mongoClient = client;
      this.global.database = db;

      await super.setup();
    }
  }

  async teardown() {
    await this.global.mongoClient.close();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
};
