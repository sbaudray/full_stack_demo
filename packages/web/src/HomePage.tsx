import React from "react";
import AppHeader from "./AppHeader";
import styles from "./HomePage.css";

let userLibraries = [
  {
    name: "TOP 10",
    movies: [
      { title: "Time and tide", director: "Tsui Hark" },
      { title: "Logan", director: "James Mangold" },
      { title: "Dersu Uzala", director: "Akira Kurosawa" },
      { title: "Lawrence of Arabia", director: "David Lean" },
    ],
  },
];

export default function Homepage() {
  return (
    <div>
      <AppHeader />
      {userLibraries.map((library) => {
        return (
          <>
            <h1>{library.name}</h1>
            <ul className={styles.moviesList}>
              {library.movies.map((movie) => {
                return (
                  <li key={movie.title} className={styles.movieCard}>
                    {movie.title} - {movie.director}
                  </li>
                );
              })}
            </ul>
          </>
        );
      })}
    </div>
  );
}
