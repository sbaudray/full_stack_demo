import React from "react";
import AppHeader from "./AppHeader";
import styles from "./HomePage.css";
import MovieSearchEngine from "./MovieSearchEngine";
import { graphql } from "react-relay";
import { useLazyLoadQuery } from "react-relay/hooks";
import ErrorBoundary from "./ErrorBoundary";
import { HomePageBookcasesQuery } from "./__generated__/HomePageBookcasesQuery.graphql";

let bookcasesQuery = graphql`
  query HomePageBookcasesQuery {
    bookcases {
      id
      name
      movies(first: 10) {
        edges {
          node {
            id
            title
            poster
            year
            director
          }
        }
      }
    }
  }
`;

function UserLibraries() {
  let data = useLazyLoadQuery<HomePageBookcasesQuery>(bookcasesQuery, {});

  return (
    <ul style={{ listStyleType: "none" }}>
      {data?.bookcases?.map((bookcase) => {
        if (!bookcase) return null;

        return (
          <li key={bookcase.id}>
            <h1>{bookcase?.name}</h1>
            <ul className={styles.moviesList}>
              {bookcase?.movies?.edges?.map((edge) => {
                let movie = edge?.node;

                if (!movie) return null;

                return (
                  <li key={movie.id} className={styles.movieCard}>
                    <img
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={movie.poster}
                      alt=""
                    />
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

export default function Homepage() {
  return (
    <div>
      <AppHeader />
      <MovieSearchEngine />
      <ErrorBoundary>
        <React.Suspense fallback="Loading bookcases">
          <UserLibraries />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}
