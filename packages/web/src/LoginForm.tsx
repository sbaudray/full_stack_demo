import styles from "./LoginForm.css";
import React, { useState, SyntheticEvent } from "react";
import { useMutation, graphql } from "react-relay/hooks";
import * as UserContext from "./UserContext";
import { LoginFormLoginMutation } from "./__generated__/LoginFormLoginMutation.graphql";

let loginMutation = graphql`
  mutation LoginFormLoginMutation($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        username
        email
      }
      resultErrors {
        message
      }
    }
  }
`;

export default function LoginForm() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState<{ message: string } | null>(null);
  let [commit, inFlight] = useMutation<LoginFormLoginMutation>(loginMutation);
  let userDispatch = UserContext.useDispatch();

  function submitForm(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    commit({
      variables: {
        input: { email, password },
      },
      onCompleted(response) {
        if (response.login?.resultErrors.length) {
          setError(response.login.resultErrors[0]);
        }
        if (response.login?.user) {
          userDispatch({ type: "setUser", payload: response.login.user });
        }
      },
    });
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.heading}>Log in</h1>
      <form className={styles.form} onSubmit={submitForm}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          className={styles.input}
          id="email"
          type="text"
          aria-label="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          className={styles.input}
          id="password"
          type="password"
          aria-label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.loginButton} disabled={inFlight}>
          Log in
        </button>
        <div className={styles.errorMessage}>{error?.message}</div>
      </form>
    </div>
  );
}
