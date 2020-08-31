import * as Library from "../library";
import Global from "../__types__/node.global";
declare var global: Global;
import { graphql } from "graphql";
import schema from "../graphql.schema";
// @ts-ignore
import moviesFixtures from "../../fixtures/movies.js";

beforeEach(async () => {
  await global.database.collection("movies").deleteMany({});
  await global.database.collection("movies").insertMany(moviesFixtures);

  Library.init(global.mongoClient);
});

it("returns a connection", async () => {
  let query = `
  {
    movies {
      edges {
        node {
          id
          title
          director
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
    }
  }
  `;
  let { data } = (await graphql(schema, query)) as any;

  expect(data.movies.edges.length).toBe(20);
  expect(data.movies.edges[0].cursor).toBe(data.movies.pageInfo.startCursor);
  expect(data.movies.edges[19].cursor).toBe(data.movies.pageInfo.endCursor);
  expect(data.movies.pageInfo.hasNextPage).toBe(false);
  expect(data.movies.pageInfo.hasPreviousPage).toBe(false);

  let nextQuery = `
  {
    movies(first: 5, after: "${data.movies.edges[10].cursor}") {
      edges {
        node {
          id
          title
          director
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
    }
  }
  `;

  let { data: nextData } = (await graphql(schema, nextQuery)) as any;

  expect(nextData.movies.edges.length).toBe(5);
  expect(nextData.movies.edges[0].cursor).toBe(data.movies.edges[11].cursor);
  expect(nextData.movies.pageInfo.hasNextPage).toBe(true);
  expect(nextData.movies.pageInfo.hasPreviousPage).toBe(false);

  let prevQuery = `
  {
    movies(last: 5, before: "${data.movies.edges[10].cursor}") {
      edges {
        node {
          id
          title
          director
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
    }
  }`;

  let { data: prevData } = (await graphql(schema, prevQuery)) as any;

  expect(prevData.movies.pageInfo.hasNextPage).toBe(false);
  expect(prevData.movies.pageInfo.hasPreviousPage).toBe(true);
  expect(prevData.movies.pageInfo.startCursor).toBe(
    data.movies.edges[5].cursor
  );
  expect(prevData.movies.pageInfo.endCursor).toBe(data.movies.edges[9].cursor);
});
