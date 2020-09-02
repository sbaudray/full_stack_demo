import React from "react";
import AppHeader from "./AppHeader";
import styles from "./HomeRoot.css";
import MovieSearchEngine from "./MovieSearchEngine";
import { graphql } from "react-relay";
import { useLazyLoadQuery } from "react-relay/hooks";
import ErrorBoundary from "./ErrorBoundary";
import { HomeRootBookcasesQuery } from "./__generated__/HomeRootBookcasesQuery.graphql";

let bookcasesQuery = graphql`
  query HomeRootBookcasesQuery {
    bookcases {
      id
      name
      movies(first: 20) @connection(key: "HomeRoot_bookcases_movies") {
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
  let data = useLazyLoadQuery<HomeRootBookcasesQuery>(bookcasesQuery, {});

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

export default function HomeRoot() {
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
