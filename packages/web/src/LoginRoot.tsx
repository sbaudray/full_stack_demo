import React from "react";
import LoginForm from "./LoginForm";
import styles from "./LoginRoot.css";

export default function LoginRoot() {
  return (
    <div className={styles.root}>
      <LoginForm />
    </div>
  );
}
