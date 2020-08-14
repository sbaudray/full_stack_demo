import * as MoviesDAO from "../movies.dao";

beforeAll(() => {
  MoviesDAO.init(global.database);
});

test("it works", async () => {
  let movies = await MoviesDAO.top10();

  expect(movies).toHaveLength(0);
});
