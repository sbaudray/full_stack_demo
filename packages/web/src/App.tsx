import React from "react";
import {
  RelayEnvironmentProvider,
  useLazyLoadQuery,
  useRelayEnvironment,
} from "react-relay/hooks";
import { graphql } from "react-relay";
import RelayEnvironment from "./RelayEnvironment";
import { AppMoviesQuery } from "./__generated__/AppMoviesQuery.graphql";
import { AppCatQuery } from "./__generated__/AppCatQuery.graphql";

const { Suspense } = React;

const MoviesQuery = graphql`
  query AppMoviesQuery {
    movies {
      edges {
        node {
          id
          director
          title
        }
      }
    }
  }
`;

export const CatQuery = graphql`
  query AppCatQuery {
    cat
  }
`;

export class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: any) {
    void 0;
  }

  render() {
    if (this.state.hasError) {
      return <div>Error</div>;
    }

    return this.props.children;
  }
}

export function Cat() {
  const data = useLazyLoadQuery<AppCatQuery>(CatQuery, {});

  return <div>{data?.cat}</div>;
}

/* export function App() { */
/*   const { movies } = useLazyLoadQuery<AppMoviesQuery>(MoviesQuery, {}); */

/*   if (!movies?.edges?.length) return <div>No Movies</div>; */

/*   return ( */
/*     <div className="App"> */
/*       <ul> */
/*         {movies.edges.map((edge) => { */
/*           let movie = edge?.node; */

/*           if (!movie) return null; */

/*           return ( */
/*             <li key={movie.id}> */
/*               <div> */
/*                 {movie.title} - {movie.director} */
/*               </div> */
/*             </li> */
/*           ); */
/*         })} */
/*       </ul> */
/*     </div> */
/*   ); */
/* } */

function AppRoot() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback={"Loading..."}>
        <Cat />
      </Suspense>
    </RelayEnvironmentProvider>
  );
}

export default AppRoot;
