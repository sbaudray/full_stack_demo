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

  return await response.json();
}

let fetchRelay: FetchFunction = async function fetchRelay(params, variables) {
  console.log(
    `fetching query ${params.name} with ${JSON.stringify(variables)}`
  );
  return fetchGraphQL(params.text, variables);
};

export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});
