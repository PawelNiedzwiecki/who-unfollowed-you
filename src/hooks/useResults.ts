import { useCallback, useMemo, useState } from "react";

type Tab = "not_following_back" | "you_dont_follow";

interface UseResultsReturn {
  tab: Tab;
  search: string;
  listKey: number;
  notFollowingBack: string[];
  youDontFollow: string[];
  activeList: string[];
  filtered: string[];
  setSearch: (value: string) => void;
  switchTab: (t: Tab) => void;
  copyAll: () => void;
  exportTxt: () => void;
}

export function useResults(
  followers: string[] | null,
  following: string[] | null,
): UseResultsReturn {
  const [tab, setTab] = useState<Tab>("not_following_back");
  const [search, setSearch] = useState("");
  const [listKey, setListKey] = useState(0);

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

  const switchTab = useCallback((t: Tab) => {
    setTab(t);
    setSearch("");
    setListKey((k) => k + 1);
  }, []);

  const copyAll = useCallback(() => {
    navigator.clipboard.writeText(activeList.join("\n"));
  }, [activeList]);

  const exportTxt = useCallback(() => {
    const blob = new Blob([activeList.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = tab === "not_following_back" ? "not_following_back.txt" : "you_dont_follow.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [activeList, tab]);

  return {
    tab,
    search,
    listKey,
    notFollowingBack,
    youDontFollow,
    activeList,
    filtered,
    setSearch,
    switchTab,
    copyAll,
    exportTxt,
  };
}
