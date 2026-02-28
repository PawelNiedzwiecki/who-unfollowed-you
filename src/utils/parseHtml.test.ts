import { describe, expect, it } from "vitest";
import { parseHtml } from "./parseHtml";

describe("parseHtml", () => {
  it("extracts usernames from instagram.com anchor tags", () => {
    const html = `
      <html><body>
        <a href="https://www.instagram.com/alice/">alice</a>
        <a href="https://www.instagram.com/bob/">bob</a>
      </body></html>
    `;
    expect(parseHtml(html)).toEqual(["alice", "bob"]);
  });

  it("ignores anchors without instagram.com in href", () => {
    const html = `
      <html><body>
        <a href="https://twitter.com/alice/">alice</a>
        <a href="https://www.instagram.com/bob/">bob</a>
      </body></html>
    `;
    expect(parseHtml(html)).toEqual(["bob"]);
  });

  it("returns an empty array when there are no matching anchors", () => {
    expect(parseHtml("<html><body><p>nothing here</p></body></html>")).toEqual(
      [],
    );
  });

  it("returns an empty array for an empty string", () => {
    expect(parseHtml("")).toEqual([]);
  });

  it("handles trailing slashes and multiple path segments correctly", () => {
    const html = `<a href="https://www.instagram.com/some_user/">x</a>`;
    expect(parseHtml(html)).toEqual(["some_user"]);
  });
});
