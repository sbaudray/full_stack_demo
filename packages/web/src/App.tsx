import React from "react";
import { RelayEnvironmentProvider, useLazyLoadQuery } from "react-relay/hooks";
import { graphql } from "react-relay";
import RelayEnvironment from "./RelayEnvironment";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginRoot from "./LoginRoot";
import HomeRoot from "./HomeRoot";
import ErrorBoundary from "./ErrorBoundary";
import * as UserContext from "./UserContext";
import { AppMeQuery } from "./__generated__/AppMeQuery.graphql";
import MovieRoot from "./MovieRoot";

const { Suspense } = React;

function AppForAliens() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LoginRoot />
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
          <HomeRoot />
        </Route>
        <Route path="/movies/:id">
          <MovieRoot />
        </Route>
      </Switch>
    </Router>
  );
}

let MeQuery = graphql`
  query AppMeQuery {
    me {
      user {
        id
        username
        email
        bookcases
      }
      resultErrors {
        message
      }
    }
  }
`;

function AppGate() {
  let [hasLoggedIn, setHasLoggedIn] = React.useState(false);
  let user = UserContext.useState();
  let userDispatch = UserContext.useDispatch();

  let { me } = useLazyLoadQuery<AppMeQuery>(MeQuery, {});

  React.useEffect(() => {
    if (me?.user) {
      setHasLoggedIn(true);
      userDispatch({ type: "login", payload: me.user });
    }
  }, [me, userDispatch]);

  // When a logged in user refreshes the page, we dont want the
  // AppForAliens to flash since the userDispatch is asynchronous
  // so we check for me.user in between, and only this time cause
  // we do not want me.user presence to prevent from logging out
  // through user context

  return (!hasLoggedIn && me?.user) || !!user ? (
    <AppForCitizens />
  ) : (
    <AppForAliens />
  );
}

function AppRoot() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <ErrorBoundary>
        <Suspense fallback={"Loading..."}>
          <UserContext.Provider>
            <AppGate />
          </UserContext.Provider>
        </Suspense>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );
}

export default AppRoot;
