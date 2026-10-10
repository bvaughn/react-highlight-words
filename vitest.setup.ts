import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  // React DEV warnings should fail tests
  vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    throw Error(`Unexpected console error: ${args.join(" ")}`);
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
