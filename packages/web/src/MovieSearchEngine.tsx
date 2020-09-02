import React from "react";
import styles from "./MovieSearchEngine.css";
import { graphql } from "react-relay";
import { useQueryLoader, usePreloadedQuery } from "react-relay/hooks";
import { MovieSearchEngineByTitleQuery } from "./__generated__/MovieSearchEngineByTitleQuery.graphql";
import { PreloadedQuery } from "react-relay/lib/relay-experimental/EntryPointTypes";
import { useDebounce } from "./useDebounce";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxPopover,
  ComboboxList,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useHistory } from "react-router-dom";

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

export default function MovieSearchEngine() {
  let history = useHistory();
  let [searchString, setSearchString] = React.useState("");
  let debouncedSearchString = useDebounce(searchString, 500);
  let [searchQueryReference, doSearchMovie] = useQueryLoader(searchQuery);

  React.useEffect(() => {
    doSearchMovie({ title: debouncedSearchString });
  }, [debouncedSearchString, doSearchMovie]);

  function onMovieSelection(id: string) {
    history.push(`/movies/${id}`);
  }

  return (
    <label className={styles.searchEngineRoot}>
      <div>Search a movie:</div>
      <Combobox onSelect={onMovieSelection}>
        <ComboboxInput
          autocomplete={false}
          value={searchString}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSearchString(event.target.value)
          }
        />
        {searchString && searchQueryReference !== null ? (
          <React.Suspense fallback={<LoadingSearchResults />}>
            <SearchResults queryReference={searchQueryReference} />
          </React.Suspense>
        ) : null}
      </Combobox>
    </label>
  );
}

interface SearchResultsProps {
  queryReference: PreloadedQuery<MovieSearchEngineByTitleQuery>;
}

function SearchResults({ queryReference }: SearchResultsProps) {
  let data = usePreloadedQuery<MovieSearchEngineByTitleQuery>(
    searchQuery,
    queryReference
  );

  if (!data.searchMovieByTitle) return null;

  return (
    <ComboboxPopover className={styles.searchResultsRoot}>
      {data.searchMovieByTitle && (
        <ComboboxList>
          {data.searchMovieByTitle.map((movie) => {
            return (
              <ComboboxOption key={movie.imdbId} value={movie.imdbId}>
                <img src={movie.poster} alt="" />
                {movie.title}
              </ComboboxOption>
            );
          })}
        </ComboboxList>
      )}
    </ComboboxPopover>
  );
}

function LoadingSearchResults() {
  return <div className={styles.loadingRoot}>L</div>;
}
