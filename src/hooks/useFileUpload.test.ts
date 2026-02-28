import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useFileUpload } from "./useFileUpload";

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

function makeFile(name: string, content: string, lastModified = 1000): File {
  return new File([content], name, { type: "text/html", lastModified });
}

// Stub FileReader globally so readAsText immediately resolves with the given text.
function stubFileReader(text: string) {
  class MockFileReader extends EventTarget {
    result = text;
    onload: (() => void) | null = null;
    readAsText() {
      Promise.resolve().then(() => this.onload?.());
    }
  }
  vi.stubGlobal("FileReader", MockFileReader);
}

describe("useFileUpload — duplicate detection", () => {
  it("shows a duplicate error when the same file is uploaded to both zones", async () => {
    stubFileReader("[]");
    const { result } = renderHook(() => useFileUpload());

    const file = makeFile("followers_1.json", "[]");

    await act(async () => result.current.handleFollowersFile(file));
    await act(async () => result.current.handleFollowingFile(file));

    expect(result.current.duplicateError).toBe(true);
    expect(result.current.followingFile).toBeNull();
  });

  it("does not show an error when two different files are uploaded", async () => {
    stubFileReader("[]");
    const { result } = renderHook(() => useFileUpload());

    await act(async () =>
      result.current.handleFollowersFile(makeFile("followers_1.json", "[]")),
    );
    await act(async () =>
      result.current.handleFollowingFile(makeFile("following.json", "[]", 2000)),
    );

    expect(result.current.duplicateError).toBe(false);
    expect(result.current.followingFile).not.toBeNull();
  });
});

describe("useFileUpload — analyse & reset", () => {
  it("canAnalyse becomes true once both files are loaded", async () => {
    stubFileReader("[]");
    const { result } = renderHook(() => useFileUpload());

    expect(result.current.canAnalyse).toBe(false);

    await act(async () =>
      result.current.handleFollowersFile(makeFile("followers_1.json", "[]")),
    );
    await act(async () =>
      result.current.handleFollowingFile(makeFile("following.json", "[]", 2000)),
    );

    expect(result.current.canAnalyse).toBe(true);
  });

  it("handleAnalyse sets analysed to true and persists to localStorage", async () => {
    stubFileReader("[]");
    const { result } = renderHook(() => useFileUpload());

    await act(async () =>
      result.current.handleFollowersFile(makeFile("followers_1.json", "[]")),
    );
    await act(async () =>
      result.current.handleFollowingFile(makeFile("following.json", "[]", 2000)),
    );
    act(() => result.current.handleAnalyse());

    expect(result.current.analysed).toBe(true);
    expect(localStorage.getItem("unfollowers_data")).not.toBeNull();
  });

  it("handleReset clears all state and localStorage", async () => {
    stubFileReader("[]");
    const { result } = renderHook(() => useFileUpload());

    await act(async () =>
      result.current.handleFollowersFile(makeFile("followers_1.json", "[]")),
    );
    await act(async () =>
      result.current.handleFollowingFile(makeFile("following.json", "[]", 2000)),
    );
    act(() => result.current.handleAnalyse());
    act(() => result.current.handleReset());

    expect(result.current.analysed).toBe(false);
    expect(result.current.followersFile).toBeNull();
    expect(result.current.followingFile).toBeNull();
    expect(localStorage.getItem("unfollowers_data")).toBeNull();
  });
});
