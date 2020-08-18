import React from "react";
import { RelayEnvironmentProvider, useLazyLoadQuery } from "react-relay/hooks";
import { graphql } from "react-relay";
import RelayEnvironment from "./RelayEnvironment";
import { AppMoviesQuery } from "./__generated__/AppMoviesQuery.graphql";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const { Suspense } = React;

const MoviesQuery = graphql`
  query AppMoviesQuery {
    movies {
      edges {
        node {
          id
          director
          title
        }
      }
    }
  }
`;

export class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(_error: Error) {
    return {
      hasError: true,
    };
  }

  render() {
    if (this.state.hasError) {
      return <div>Error</div>;
    }

    return this.props.children;
  }
}

export function App() {
  const { movies } = useLazyLoadQuery<AppMoviesQuery>(MoviesQuery, {});

  if (!movies?.edges?.length) return <div>No Movies</div>;

  return (
    <div className="App">
      <ul>
        {movies.edges.map((edge) => {
          let movie = edge?.node;

          if (!movie) return null;

          return (
            <li key={movie.id}>
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

function Routing() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <div>Hello</div>
        </Route>
        <Route path="/movies">
          <App />
        </Route>
      </Switch>
    </Router>
  );
}

function AppRoot() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback={"Loading..."}>
        <Routing />
      </Suspense>
    </RelayEnvironmentProvider>
  );
}

export default AppRoot;
