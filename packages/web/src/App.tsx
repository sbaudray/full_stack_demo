import React from "react";
import { RelayEnvironmentProvider, useLazyLoadQuery } from "react-relay/hooks";
import { graphql } from "react-relay";
import RelayEnvironment from "./RelayEnvironment";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import ErrorBoundary from "./ErrorBoundary";
import * as UserContext from "./UserContext";
import { AppMeQuery } from "./__generated__/AppMeQuery.graphql";

const { Suspense } = React;

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
          <HomePage />
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
  let isLoggedIn = UserContext.useState();
  let userDispatch = UserContext.useDispatch();

  let { me } = useLazyLoadQuery<AppMeQuery>(MeQuery, {});

  React.useEffect(() => {
    if (me?.user) {
      userDispatch({ type: "setUser", payload: me.user });
    }
  }, [me, userDispatch]);

  return me?.user || isLoggedIn ? <AppForCitizens /> : <AppForAliens />;
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
