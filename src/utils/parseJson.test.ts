import { describe, expect, it } from "vitest";
import { parseJson } from "./parseJson";

const makeEntry = (value: string) => ({
  title: "",
  string_list_data: [{ href: `https://www.instagram.com/${value}/`, value, timestamp: 0 }],
});

describe("parseJson", () => {
  it("parses the followers_1.json shape (top-level array)", () => {
    const json = JSON.stringify([makeEntry("alice"), makeEntry("bob")]);
    expect(parseJson(json)).toEqual(["alice", "bob"]);
  });

  it("parses the following.json shape (relationships_following wrapper)", () => {
    const json = JSON.stringify({
      relationships_following: [makeEntry("charlie"), makeEntry("dana")],
    });
    expect(parseJson(json)).toEqual(["charlie", "dana"]);
  });

  it("returns an empty array for invalid JSON", () => {
    expect(parseJson("not json")).toEqual([]);
  });

  it("returns an empty array for an empty string", () => {
    expect(parseJson("")).toEqual([]);
  });

  it("returns an empty array for an unrecognised JSON shape", () => {
    expect(parseJson(JSON.stringify({ foo: "bar" }))).toEqual([]);
  });

  it("skips entries that have no value field", () => {
    const json = JSON.stringify([
      { string_list_data: [{}] },
      makeEntry("alice"),
    ]);
    expect(parseJson(json)).toEqual(["alice"]);
  });
});
