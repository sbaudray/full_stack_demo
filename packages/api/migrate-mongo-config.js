// In this file you can configure migrate-mongo
const dotenv = require("dotenv");

dotenv.config();

const config = {
  mongodb: {
    url:
      process.env.MONGO_DB_URI ||
      "mongodb://root:root@localhost:27017?retryWrites=true",
    databaseName: process.env.MONGO_DB_NAME,

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      wtimeout: 2500,
    },
  },

  migrationsDir: "migrations",

  changelogCollectionName: "changelog",

  migrationFileExtension: ".js",
};

module.exports = config;
