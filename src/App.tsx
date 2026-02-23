import { useCallback, useEffect, useMemo, useState } from "react";
import UploadZone from "./components/UploadZone";
import StatCard from "./components/StatCard";
import SearchBar from "./components/SearchBar";
import UserRow from "./components/UserRow";
import { parseHtml } from "./utils/parseHtml";
import { clearData, loadData, saveData } from "./utils/storage";

type Tab = "not_following_back" | "you_dont_follow";

function App() {
  const [followers, setFollowers] = useState<string[] | null>(null);
  const [following, setFollowing] = useState<string[] | null>(null);
  const [followersFile, setFollowersFile] = useState<File | null>(null);
  const [followingFile, setFollowingFile] = useState<File | null>(null);
  const [analysed, setAnalysed] = useState(false);
  const [tab, setTab] = useState<Tab>("not_following_back");
  const [search, setSearch] = useState("");

  // Load persisted data on mount
  useEffect(() => {
    const stored = loadData();
    if (stored) {
      setFollowers(stored.followers);
      setFollowing(stored.following);
      setAnalysed(true);
    }
  }, []);

  const readFile = useCallback(
    (file: File, setter: (usernames: string[]) => void) => {
      const reader = new FileReader();
      reader.onload = () => {
        const html = reader.result as string;
        setter(parseHtml(html));
      };
      reader.readAsText(file);
    },
    [],
  );

  const handleFollowersFile = useCallback(
    (file: File) => {
      setFollowersFile(file);
      readFile(file, setFollowers);
    },
    [readFile],
  );

  const handleFollowingFile = useCallback(
    (file: File) => {
      setFollowingFile(file);
      readFile(file, setFollowing);
    },
    [readFile],
  );

  const canAnalyse = followers !== null && following !== null && !analysed;

  const handleAnalyse = useCallback(() => {
    if (followers && following) {
      saveData({ followers, following });
      setAnalysed(true);
    }
  }, [followers, following]);

  const handleReset = useCallback(() => {
    clearData();
    setFollowers(null);
    setFollowing(null);
    setFollowersFile(null);
    setFollowingFile(null);
    setAnalysed(false);
    setSearch("");
    setTab("not_following_back");
  }, []);

  // Compute sets
  const notFollowingBack = useMemo(() => {
    if (!followers || !following) return [];
    const followerSet = new Set(followers);
    return following.filter((u) => !followerSet.has(u));
  }, [followers, following]);

  const youDontFollow = useMemo(() => {
    if (!followers || !following) return [];
    const followingSet = new Set(following);
    return followers.filter((u) => !followingSet.has(u));
  }, [followers, following]);

  const activeList = tab === "not_following_back" ? notFollowingBack : youDontFollow;

  const filtered = useMemo(() => {
    if (!search.trim()) return activeList;
    const q = search.toLowerCase();
    return activeList.filter((u) => u.toLowerCase().includes(q));
  }, [activeList, search]);

  const copyAll = useCallback(() => {
    const text = activeList.join("\n");
    navigator.clipboard.writeText(text);
  }, [activeList]);

  const exportTxt = useCallback(() => {
    const text = activeList.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      tab === "not_following_back"
        ? "not_following_back.txt"
        : "you_dont_follow.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [activeList, tab]);

  // ── Upload page ──
  if (!analysed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-12">
        <div className="animate-fade-in w-full">
          <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-text">
            Unfollowers
          </h1>
          <p className="mb-8 text-center text-sm text-text-muted">
            Instagram non-follower analyser — 100% client-side, nothing is
            uploaded anywhere.
          </p>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UploadZone
              label="followers_1.html"
              hint="Your followers list"
              file={followersFile}
              onFile={handleFollowersFile}
            />
            <UploadZone
              label="following.html"
              hint="Accounts you follow"
              file={followingFile}
              onFile={handleFollowingFile}
            />
          </div>

          <button
            disabled={!canAnalyse}
            onClick={handleAnalyse}
            className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
              canAnalyse
                ? "cursor-pointer bg-accent text-bg hover:bg-accent-hover"
                : "cursor-not-allowed bg-surface text-text-muted"
            }`}
          >
            Analyse
          </button>

          <div className="mt-8 rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-text-muted">
            <p className="mb-2 font-semibold text-text">
              How to get your data from Instagram:
            </p>
            <ol className="list-inside list-decimal space-y-1">
              <li>
                Go to{" "}
                <span className="font-mono text-accent">
                  Settings → Accounts Centre → Your information and permissions →
                  Download your information
                </span>
              </li>
              <li>
                Select your Instagram account and choose{" "}
                <span className="font-mono text-accent">
                  &quot;Some of your information&quot;
                </span>
              </li>
              <li>
                Select{" "}
                <span className="font-mono text-accent">
                  Followers and following
                </span>
              </li>
              <li>
                Choose format:{" "}
                <span className="font-mono text-accent">HTML</span> and click{" "}
                <span className="font-mono text-accent">Create file</span>
              </li>
              <li>
                Download the archive and extract{" "}
                <span className="font-mono text-accent">
                  followers_1.html
                </span>{" "}
                and{" "}
                <span className="font-mono text-accent">following.html</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // ── Results page ──
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8">
      {/* Header */}
      <div className="animate-fade-in mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-text">
          Unfollowers
        </h1>
        <button
          onClick={handleReset}
          className="cursor-pointer rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-accent hover:text-accent"
        >
          Reset
        </button>
      </div>

      {/* Stats */}
      <div className="animate-fade-in mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Followers" value={followers?.length ?? 0} />
        <StatCard label="Following" value={following?.length ?? 0} />
        <StatCard
          label="Don't follow back"
          value={notFollowingBack.length}
          accent
        />
        <StatCard
          label="You don't follow"
          value={youDontFollow.length}
          accent
        />
      </div>

      {/* Tabs */}
      <div className="animate-fade-in-delay mb-4 flex gap-2">
        <button
          onClick={() => {
            setTab("not_following_back");
            setSearch("");
          }}
          className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "not_following_back"
              ? "bg-accent text-bg"
              : "bg-surface text-text-muted hover:text-text"
          }`}
        >
          Don&apos;t follow you back ({notFollowingBack.length})
        </button>
        <button
          onClick={() => {
            setTab("you_dont_follow");
            setSearch("");
          }}
          className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "you_dont_follow"
              ? "bg-accent text-bg"
              : "bg-surface text-text-muted hover:text-text"
          }`}
        >
          You don&apos;t follow back ({youDontFollow.length})
        </button>
      </div>

      {/* Search + actions */}
      <div className="animate-fade-in-delay mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyAll}
            className="cursor-pointer rounded-lg border border-border px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-accent hover:text-accent"
          >
            Copy all
          </button>
          <button
            onClick={exportTxt}
            className="cursor-pointer rounded-lg border border-border px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-accent hover:text-accent"
          >
            Export as .txt
          </button>
        </div>
      </div>

      {/* List */}
      <div className="animate-fade-in-delay flex flex-1 flex-col gap-2 overflow-y-auto">
        {filtered.map((username, i) => (
          <UserRow key={username} username={username} index={i + 1} />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-16 text-sm text-text-muted">
            {search ? "No usernames match your search." : "No results."}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-border pt-3 text-center text-xs text-text-muted">
        Showing {filtered.length} of {activeList.length} results
      </div>
    </div>
  );
}

export default App;
