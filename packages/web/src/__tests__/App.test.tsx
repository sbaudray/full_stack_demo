import React, { Suspense } from "react";
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils";
import { Cat, ErrorBoundary } from "../App";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { render, waitFor } from "@testing-library/react";

it("errors", async () => {
  let environment = createMockEnvironment();

  let { getByText } = render(
    <RelayEnvironmentProvider environment={environment}>
      <ErrorBoundary>
        <Suspense fallback="Loading">
          <Cat />
        </Suspense>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );

  environment.mock.rejectMostRecentOperation(new Error("FATAL"));

  await waitFor(() => expect(getByText("Error")).toBeInTheDocument());
});

it("resolves", async () => {
  let environment = createMockEnvironment();

  let { getByText } = render(
    <RelayEnvironmentProvider environment={environment}>
      <ErrorBoundary>
        <Suspense fallback="Loading">
          <Cat />
        </Suspense>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );

  environment.mock.resolveMostRecentOperation((operation) =>
    MockPayloadGenerator.generate(operation, {
      String() {
        return "TEST";
      },
    })
  );

  await waitFor(() => expect(getByText("TEST")).toBeInTheDocument());
});

it("waits", () => {
  let environment = createMockEnvironment();

  let { getByText } = render(
    <RelayEnvironmentProvider environment={environment}>
      <ErrorBoundary>
        <Suspense fallback="Loading">
          <Cat />
        </Suspense>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );

  expect(getByText("Loading")).toBeInTheDocument();
});

