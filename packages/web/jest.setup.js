import "@testing-library/jest-dom";
import chalk from "chalk";
import util from "util";

const env = jasmine.getEnv();

function shouldIgnoreConsoleError(format) {
  if (format.indexOf("Error: Uncaught [") === 0) {
    // This looks like an uncaught error from invokeGuardedCallback() wrapper
    // in development that is reported by jsdom. Ignore because it's noisy.
    return true;
  }
  if (format.indexOf("The above error occurred") === 0) {
    // This looks like an error addendum from ReactFiberErrorLogger.
    // Ignore it too.
    return true;
  }

  return false;
}

["error", "warn"].forEach((methodName) => {
  const unexpectedConsoleCallStacks = [];
  const newMethod = function(format, ...args) {
    // Ignore uncaught errors reported by jsdom
    // and React addendums because they're too noisy.
    if (methodName === "error" && shouldIgnoreConsoleError(format)) {
      return;
    }

    // Capture the call stack now so we can warn about it later.
    // The call stack has helpful information for the test author.
    // Don't throw yet though b'c it might be accidentally caught and suppressed.
    const stack = new Error().stack;
    unexpectedConsoleCallStacks.push([
      stack.substr(stack.indexOf("\n") + 1),
      util.format(format, ...args),
    ]);
  };

  console[methodName] = newMethod;

  env.beforeEach(() => {
    unexpectedConsoleCallStacks.length = 0;
  });

  env.afterEach(() => {
    if (unexpectedConsoleCallStacks.length > 0) {
      const messages = unexpectedConsoleCallStacks.map(
        ([stack, message]) =>
          `${chalk.red(message)}\n` +
          `${stack
            .split("\n")
            .map((line) => chalk.gray(line))
            .join("\n")}`
      );

      throw new Error(messages.join("\n\n"));
    }
  });
});
