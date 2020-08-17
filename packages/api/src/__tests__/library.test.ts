import * as Library from "../library";
import Global from "../__types__/node.global";
declare var global: Global;

import Fixtures from "node-mongodb-fixtures";
let fixtures = new Fixtures();

beforeAll(async () => {
  global.database.dropDatabase();

  await fixtures
    .connect(process.env.MONGO_DB_URI, {}, process.env.MONGO_DB_NAME)
    .then(() => fixtures.load())
    .then(() => fixtures.disconnect());

  Library.init(global.database);
});

it("lists movies", async () => {
  let movies = await Library.cursorMovies().toArray();

  expect(movies.length).toBe(20);
});

it("creates a movie", async () => {
  let movie = await Library.createMovie({
    title: "Batman",
    director: "Robin",
  });

  expect(movie.title).toBe("Batman");
  expect(movie.director).toBe("Robin");
  expect(movie._id).toBeDefined();
});
