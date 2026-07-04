import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { getEnv } from "./env";

describe("getEnv", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("returns value from process.env", () => {
    process.env.TEST_KEY = "test_value";
    expect(getEnv("TEST_KEY")).toBe("test_value");
  });

  test("returns default value when key is not in process.env", () => {
    expect(getEnv("NON_EXISTENT_KEY", "default")).toBe("default");
  });

  test("returns empty string when key is not in process.env and no default provided", () => {
    expect(getEnv("NON_EXISTENT_KEY")).toBe("");
  });
});
