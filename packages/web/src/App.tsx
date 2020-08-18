import React, { SyntheticEvent } from "react";
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

function LoginPage() {
  function submitForm(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
  }
  return (
    <>
      <form onSubmit={submitForm}>
        <input
          id="username"
          type="text"
          placeholder="Email"
          aria-label="Email"
          autoComplete="username"
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          aria-label="Password"
          autoComplete="current-password"
        />
        <button>Login</button>
      </form>
    </>
  );
}

function AppForAliens() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LoginPage />
        </Route>
      </Switch>
    </Router>
  );
}

function AppForCitizens() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
      </Switch>
    </Router>
  );
}

function AppRoot() {
  let isLoggedIn = false;

  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback={"Loading..."}>
        {isLoggedIn ? <AppForCitizens /> : <AppForAliens />}
      </Suspense>
    </RelayEnvironmentProvider>
  );
}

export default AppRoot;
