const MongoClient = require("mongodb").MongoClient;
const NodeEnvironment = require("jest-environment-node");

process.env.MONGO_DB_URI =
  "mongodb://root:root@localhost:27017?retryWrites=true";
process.env.MONGO_DB_NAME = "demo_test";

module.exports = class MongoEnvironment extends NodeEnvironment {
  async setup() {
    if (!this.global.mongoClient && !this.global.database) {
      let client = await MongoClient.connect(process.env.MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        wtimeout: 2500,
      });

      let db = client.db(process.env.MONGO_DB_NAME);

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
