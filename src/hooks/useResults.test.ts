import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useResults } from "./useResults";

const followers = ["alice", "bob", "charlie"];
const following = ["bob", "charlie", "dana"];

describe("useResults", () => {
  it("computes notFollowingBack (following who do not follow back)", () => {
    const { result } = renderHook(() => useResults(followers, following));
    expect(result.current.notFollowingBack).toEqual(["dana"]);
  });

  it("computes youDontFollow (followers you do not follow back)", () => {
    const { result } = renderHook(() => useResults(followers, following));
    expect(result.current.youDontFollow).toEqual(["alice"]);
  });

  it("defaults to the not_following_back tab", () => {
    const { result } = renderHook(() => useResults(followers, following));
    expect(result.current.tab).toBe("not_following_back");
    expect(result.current.activeList).toEqual(["dana"]);
  });

  it("switches tab and resets search", () => {
    const { result } = renderHook(() => useResults(followers, following));

    act(() => result.current.setSearch("d"));
    act(() => result.current.switchTab("you_dont_follow"));

    expect(result.current.tab).toBe("you_dont_follow");
    expect(result.current.search).toBe("");
    expect(result.current.activeList).toEqual(["alice"]);
  });

  it("increments listKey on tab switch", () => {
    const { result } = renderHook(() => useResults(followers, following));
    const initialKey = result.current.listKey;

    act(() => result.current.switchTab("you_dont_follow"));

    expect(result.current.listKey).toBe(initialKey + 1);
  });

  it("filters the active list by search query", () => {
    const { result } = renderHook(() =>
      useResults(["alice", "alex", "bob"], ["charlie"]),
    );
    act(() => result.current.switchTab("you_dont_follow"));
    act(() => result.current.setSearch("al"));

    expect(result.current.filtered).toEqual(["alice", "alex"]);
  });

  it("returns empty arrays when inputs are null", () => {
    const { result } = renderHook(() => useResults(null, null));
    expect(result.current.notFollowingBack).toEqual([]);
    expect(result.current.youDontFollow).toEqual([]);
  });
});
