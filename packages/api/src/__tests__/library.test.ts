import * as Library from "../library";
import Global from "../__types__/node.global";
declare var global: Global;

beforeAll(() => {
  global.database.dropDatabase();

  Library.init(global.database);
});

test("im not totally bad", async () => {
  let movies = await Library.listMovies().toArray();
  console.log(movies);
  expect(movies.length).toBe(40);
});

test("can create a movie", async () => {
  let result = await Library.createMovie({
    title: "Batman",
    director: "Robin",
  });

  expect(result.movie.title).toBe("Batman");
  expect(result.movie.director).toBe("Robin");
  expect(result.movie._id).toBeDefined();
});
