import React from "react";
import styles from "./MovieSearchEngine.css";
import { graphql } from "react-relay";
import {
  useQueryLoader,
  usePreloadedQuery,
  useMutation,
} from "react-relay/hooks";
import { MovieSearchEngineByTitleQuery } from "./__generated__/MovieSearchEngineByTitleQuery.graphql";
import { PreloadedQuery } from "react-relay/lib/relay-experimental/EntryPointTypes";
import { useDebounce } from "./useDebounce";
import { MovieSearchEngineDetailsQuery } from "./__generated__/MovieSearchEngineDetailsQuery.graphql";
import { MovieSearchEngineAddMovieToBookcaseMutation } from "./__generated__/MovieSearchEngineAddMovieToBookcaseMutation.graphql";
import * as UserContext from "./UserContext";

let searchQuery = graphql`
  query MovieSearchEngineByTitleQuery($title: String!) {
    searchMovieByTitle(title: $title) {
      title
      year
      poster
      imdbId
    }
  }
`;

let movieDetailsQuery = graphql`
  query MovieSearchEngineDetailsQuery($id: String!) {
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

let addMovieToBookcaseMutation = graphql`
  mutation MovieSearchEngineAddMovieToBookcaseMutation(
    $input: AddMovieToBookcaseInput!
  ) {
    addMovieToBookcase(input: $input) {
      ok
    }
  }
`;

export default function MovieSearchEngine() {
  let root = React.createRef<HTMLDivElement>();
  let [searchString, setSearchString] = React.useState("");
  let debouncedSearchString = useDebounce(searchString, 1000);
  let [selectedMovieId, setSelectedMovieId] = React.useState("");
  let [
    searchQueryReference,
    doSearchMovie,
    disposeSearchQuery,
  ] = useQueryLoader(searchQuery);
  let [
    movieDetailsQueryReference,
    doSearchMovieDetails,
    disposeMovieDetailsQuery,
  ] = useQueryLoader(movieDetailsQuery);

  React.useEffect(() => {
    doSearchMovie({ title: debouncedSearchString });
  }, [debouncedSearchString, doSearchMovie]);

  React.useEffect(() => {
    doSearchMovieDetails({ id: selectedMovieId });
  }, [selectedMovieId, doSearchMovieDetails]);

  function selectMovie(id: string) {
    disposeSearchQuery();
    setSelectedMovieId(id);
  }

  return (
    <div ref={root}>
      <input
        type="text"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />
      {selectedMovieId && movieDetailsQueryReference !== null ? (
        <React.Suspense fallback="loading details">
          <MovieDetails
            disposeQuery={disposeMovieDetailsQuery}
            queryReference={movieDetailsQueryReference}
          />
        </React.Suspense>
      ) : null}
      {searchString && searchQueryReference !== null ? (
        <React.Suspense fallback="loading results">
          <SearchResults
            selectMovie={selectMovie}
            disposeQuery={disposeSearchQuery}
            queryReference={searchQueryReference}
          />
        </React.Suspense>
      ) : null}
    </div>
  );
}

interface MovieDetailsProps {
  queryReference: PreloadedQuery<MovieSearchEngineDetailsQuery>;
  disposeQuery: any;
}

function MovieDetails({ queryReference, disposeQuery }: MovieDetailsProps) {
  let user = UserContext.useState();
  let data = usePreloadedQuery<MovieSearchEngineDetailsQuery>(
    movieDetailsQuery,
    queryReference
  );

  let [commit, isInFlight] = useMutation<
    MovieSearchEngineAddMovieToBookcaseMutation
  >(addMovieToBookcaseMutation);

  function addMovieToBookcase() {
    if (!user || !data.searchMovieByImdbId) return;

    commit({
      variables: {
        input: {
          movie: data.searchMovieByImdbId,
          bookcaseId: user?.bookcases[0],
        },
      },
      onCompleted: (data) => console.log(data),
    });
  }

  if (!data.searchMovieByImdbId) {
    return null;
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

interface SearchResultsProps {
  queryReference: PreloadedQuery<MovieSearchEngineByTitleQuery>;
  disposeQuery: any;
  selectMovie: (id: string) => void;
}

function SearchResults({
  queryReference,
  disposeQuery,
  selectMovie,
}: SearchResultsProps) {
  let data = usePreloadedQuery<MovieSearchEngineByTitleQuery>(
    searchQuery,
    queryReference
  );

  if (!data.searchMovieByTitle) {
    return null;
  }

  return (
    <>
      <button onClick={disposeQuery}>Clear results</button>
      <ul className={styles.resultList}>
        {data.searchMovieByTitle.map((movie) => (
          <li
            onClick={() => {
              selectMovie(movie.imdbId);
            }}
            className={styles.resultItem}
            key={movie.imdbId}
          >
            <img src={movie.poster} alt="" />
            {movie.title} {movie.year} {movie.imdbId}
          </li>
        ))}
      </ul>
    </>
  );
}
