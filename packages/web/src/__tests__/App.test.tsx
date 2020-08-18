import React, { Suspense } from "react";
import {
  createMockEnvironment,
  MockPayloadGenerator,
  RelayMockEnvironment,
} from "relay-test-utils";
import { App, ErrorBoundary } from "../App";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { render, waitFor } from "@testing-library/react";

function renderApp(environment: RelayMockEnvironment) {
  return render(
    <RelayEnvironmentProvider environment={environment}>
      <ErrorBoundary>
        <Suspense fallback="Loading">
          <App />
        </Suspense>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );
}

it("errors", async () => {
  let environment = createMockEnvironment();

  let { getByText } = renderApp(environment);

  environment.mock.rejectMostRecentOperation(new Error("FATAL"));

  await waitFor(() => expect(getByText("Error")).toBeInTheDocument());
});

it("resolves", async () => {
  let environment = createMockEnvironment();

  let { getByText } = renderApp(environment);

  environment.mock.resolveMostRecentOperation((operation) =>
    MockPayloadGenerator.generate(operation, {
      Movie() {
        return {
          title: "Batman",
          director: "Robin",
        };
      },
      String() {
        return "TEST";
      },
    })
  );

  await waitFor(() => expect(getByText("Batman - Robin")).toBeInTheDocument());
});

it("waits", () => {
  let environment = createMockEnvironment();

  let { getByText } = renderApp(environment);

  expect(getByText("Loading")).toBeInTheDocument();
});

