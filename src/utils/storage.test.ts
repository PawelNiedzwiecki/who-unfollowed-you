import { afterEach, describe, expect, it } from "vitest";
import { clearData, loadData, saveData } from "./storage";

afterEach(() => {
  localStorage.clear();
});

describe("saveData / loadData", () => {
  it("round-trips followers and following arrays", () => {
    const data = { followers: ["alice", "bob"], following: ["charlie"] };
    saveData(data);
    expect(loadData()).toEqual(data);
  });

  it("returns null when nothing has been saved", () => {
    expect(loadData()).toBeNull();
  });

  it("returns null when the stored value is malformed JSON", () => {
    localStorage.setItem("unfollowers_data", "{bad json}");
    expect(loadData()).toBeNull();
  });

  it("returns null when the stored value is missing required keys", () => {
    localStorage.setItem("unfollowers_data", JSON.stringify({ followers: [] }));
    expect(loadData()).toBeNull();
  });
});

describe("clearData", () => {
  it("removes previously saved data", () => {
    saveData({ followers: ["alice"], following: [] });
    clearData();
    expect(loadData()).toBeNull();
  });

  it("does not throw when there is nothing to clear", () => {
    expect(() => clearData()).not.toThrow();
  });
});
