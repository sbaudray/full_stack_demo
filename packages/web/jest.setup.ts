import "@testing-library/jest-dom";

let original = console["error"];

function logError(...args: any) {
  let [format] = args;
  if (format.indexOf("Error: Uncaught [") === 0) {
    // This looks like an uncaught error from invokeGuardedCallback() wrapper
    // in development that is reported by jsdom. Ignore because it's noisy.
    return;
  }
  if (format.indexOf("The above error occurred") === 0) {
    // This looks like an error addendum from ReactFiberErrorLogger.
    // Ignore it too.
    return;
  }

  original(...args);
}

console["error"] = logError;
