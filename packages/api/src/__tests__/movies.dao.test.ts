import * as MoviesDAO from "../movies.dao";
import Global from "../__types__/node.global";
declare var global: Global;

beforeAll(() => {
  global.database.dropDatabase();

  MoviesDAO.init(global.database);
});

test("it works", async () => {
  let movies = await MoviesDAO.top10();

  expect(movies).toHaveLength(0);
});

test("can create a movie", async () => {
  let result = await MoviesDAO.create({
    title: "Batman",
    director: "Robin",
  });

  expect(result.movie.title).toBe("Batman");
  expect(result.movie.director).toBe("Robin");
  expect(result.movie._id).toBeDefined();
});
