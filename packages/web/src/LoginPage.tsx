import React from "react";
import LoginForm from "./LoginForm";
import styles from "./LoginPage.css";

export default function LoginPage() {
  return (
    <div className={styles.root}>
      <LoginForm />
    </div>
  );
}
