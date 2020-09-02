import React from "react";
import * as UserContext from "./UserContext";
import { graphql } from "react-relay";
import { useMutation, useLazyLoadQuery } from "react-relay/hooks";
import { MovieRootAddMovieToBookcaseMutation } from "./__generated__/MovieRootAddMovieToBookcaseMutation.graphql";
import { ConnectionHandler } from "relay-runtime";
import styles from "./MovieRoot.css";
import { MovieRootMovieDetailsQuery } from "./__generated__/MovieRootMovieDetailsQuery.graphql";
import { useRouteMatch } from "react-router-dom";

let addMovieToBookcaseMutation = graphql`
  mutation MovieRootAddMovieToBookcaseMutation(
    $input: AddMovieToBookcaseInput!
  ) {
    addMovieToBookcase(input: $input) {
      movie {
        id
        title
        poster
        year
        director
      }
    }
  }
`;

let movieDetailsQuery = graphql`
  query MovieRootMovieDetailsQuery($id: String!) {
    searchMovieByImdbId(id: $id) {
      director
      title
      year
      imdbId
      imdbRating
      writer
      runtime
      released
      poster
      plot
      languages
      genres
      country
      actors
    }
  }
`;

function MovieRoot() {
  let user = UserContext.useState();
  let routeMatch = useRouteMatch<{ id: string }>();

  let data = useLazyLoadQuery<MovieRootMovieDetailsQuery>(movieDetailsQuery, {
    id: routeMatch.params.id,
  });

  let [commit] = useMutation<MovieRootAddMovieToBookcaseMutation>(
    addMovieToBookcaseMutation
  );

  function addMovieToBookcase() {
    if (!user || !data.searchMovieByImdbId) return;

    commit({
      variables: {
        input: {
          movie: data.searchMovieByImdbId,
          bookcaseId: user?.bookcases[0],
        },
      },
      updater: (store) => {
        if (!user?.bookcases[0]) return;

        let bookcaseRecord = store.get(user?.bookcases[0]);

        let connectionRecord =
          bookcaseRecord &&
          ConnectionHandler.getConnection(
            bookcaseRecord,
            "HomeRoot_bookcases_movies"
          );

        let payload = store.getRootField("addMovieToBookcase");

        let edge = payload.getLinkedRecord("movie");

        let newEdge =
          connectionRecord &&
          ConnectionHandler.createEdge(
            store,
            connectionRecord,
            edge,
            "MovieEdge"
          );

        if (newEdge && connectionRecord) {
          ConnectionHandler.insertEdgeAfter(connectionRecord, newEdge);
        }
      },
    });
  }

  if (!data.searchMovieByImdbId) {
    return <div>Unable to look up details</div>;
  }

  let {
    actors,
    country,
    director,
    genres,
    poster,
    runtime,
    title,
    year,
  } = data.searchMovieByImdbId;

  return (
    <div className={styles.movieDetailsRoot}>
      <img src={poster} alt="" />
      <div>
        <div>
          <strong>Country: </strong>
          {country}
        </div>
        <div>
          <strong>Title: </strong>
          {title}
        </div>
        <div>
          <strong>Director: </strong>
          {director}
        </div>
        <div>
          <strong>Actors: </strong>
          {actors}
        </div>
        <div>
          <strong>Genres: </strong>
          {genres}
        </div>
        <div>
          <strong>Year: </strong>
          {year}
        </div>
        <div>
          <strong>Runtime: </strong>
          {runtime}
        </div>
        <button onClick={addMovieToBookcase}>Add to Collection</button>
      </div>
    </div>
  );
}

export default MovieRoot;
