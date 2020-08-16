import React from "react";
import { RelayEnvironmentProvider, useLazyLoadQuery } from "react-relay/hooks";
import { graphql } from "react-relay";
import RelayEnvironment from "./RelayEnvironment";
import { AppMoviesQuery } from "./__generated__/AppMoviesQuery.graphql";

const { Suspense } = React;

// Define a query
const MoviesQuery = graphql`
  query AppMoviesQuery {
    top10 {
      _id
      title
      director
    }
  }
`;

function App() {
  const { top10 } = useLazyLoadQuery<AppMoviesQuery>(MoviesQuery, {});

  return (
    <div className="App">
      <ul>
        {top10?.map((movie) => {
          if (!movie) {
            return null;
          }

          return (
            <li key={movie._id}>
              <div>
                {movie.title} - {movie.director}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AppRoot() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback={"Loading..."}>
        <App />
      </Suspense>
    </RelayEnvironmentProvider>
  );
}

export default AppRoot;
