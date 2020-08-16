import {
  Environment,
  Network,
  RecordSource,
  Store,
  Variables,
  RequestParameters,
  FetchFunction,
} from "relay-runtime";

async function fetchGraphQL(
  text: RequestParameters["text"],
  variables: Variables
) {
  // Fetch data from GitHub's GraphQL API:
  const response = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  });

  // Get the response as JSON
  return await response.json();
}
// Relay passes a "params" object with the query name and text. So we define a helper function
// to call our fetchGraphQL utility with params.text.
let fetchRelay: FetchFunction = async function fetchRelay(params, variables) {
  console.log(
    `fetching query ${params.name} with ${JSON.stringify(variables)}`
  );
  return fetchGraphQL(params.text, variables);
};

// Export a singleton instance of Relay Environment configured with our network function:
export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});
