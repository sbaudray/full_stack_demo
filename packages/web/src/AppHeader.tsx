import React from "react";
import styles from "./AppHeader.css";
import { graphql } from "react-relay";
import { useMutation } from "react-relay/hooks";
import { AppHeaderLogoutMutation } from "./__generated__/AppHeaderLogoutMutation.graphql";
import * as UserContext from "./UserContext";

let logoutMutation = graphql`
  mutation AppHeaderLogoutMutation {
    logout {
      ok
    }
  }
`;

export default function AppHeader() {
  let [doLogout] = useMutation<AppHeaderLogoutMutation>(logoutMutation);
  let userDispatch = UserContext.useDispatch();

  function logout() {
    doLogout({
      variables: {},
      onCompleted: (data) => {
        if (data.logout?.ok) {
          userDispatch({ type: "logout" });
        }
      },
    });
  }

  return (
    <header className={styles.root}>
      <div>FS DEMO</div>
      <button onClick={logout}>Logout</button>
    </header>
  );
}
