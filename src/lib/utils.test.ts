import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges basic class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("merges tailwind classes properly", () => {
    expect(cn("px-2 py-1", "p-4")).toBe("p-4");
  });

  it("handles conditional classes", () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn("foo", isTrue && "bar", isFalse && "baz")).toBe("foo bar");
  });

  it("handles arrays of classes", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("handles objects with truthy/falsy values", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("handles mixed inputs", () => {
    const isTrue = true;
    expect(cn("foo", ["bar", { baz: true, qux: false }], isTrue && "quux")).toBe(
      "foo bar baz quux"
    );
  });

  it("removes undefined, null, and false values", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("merges conflicting tailwind classes correctly", () => {
    expect(cn("bg-red-500 text-white", "bg-blue-500")).toBe("text-white bg-blue-500");
  });
});
