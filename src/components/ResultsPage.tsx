import { AnimatePresence, type Variants, motion } from "motion/react";
import SearchBar from "./SearchBar";
import StatCard from "./StatCard";
import ThemeToggle from "./ThemeToggle";
import UserRow from "./UserRow";

const fadeUp: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.07 } },
};

type Tab = "not_following_back" | "you_dont_follow";

const TAB_LABELS: Record<Tab, (count: number) => string> = {
  not_following_back: (n) => `Don't follow you back (${n})`,
  you_dont_follow: (n) => `You don't follow back (${n})`,
};

interface ResultsPageProps {
  theme: "light" | "dark";
  followers: string[] | null;
  following: string[] | null;
  notFollowingBack: string[];
  youDontFollow: string[];
  activeList: string[];
  filtered: string[];
  tab: Tab;
  search: string;
  listKey: number;
  onThemeToggle: () => void;
  onReset: () => void;
  onSwitchTab: (t: Tab) => void;
  onSearch: (value: string) => void;
  onCopyAll: () => void;
  onExportTxt: () => void;
}

export default function ResultsPage({
  theme,
  followers,
  following,
  notFollowingBack,
  youDontFollow,
  activeList,
  filtered,
  tab,
  search,
  listKey,
  onThemeToggle,
  onReset,
  onSwitchTab,
  onSearch,
  onCopyAll,
  onExportTxt,
}: ResultsPageProps) {
  const statCards = [
    { label: "Followers", value: followers?.length ?? 0 },
    { label: "Following", value: following?.length ?? 0 },
    { label: "Don't follow back", value: notFollowingBack.length, accent: true },
    { label: "You don't follow", value: youDontFollow.length, accent: true },
  ];

  const tabCounts: Record<Tab, number> = {
    not_following_back: notFollowingBack.length,
    you_dont_follow: youDontFollow.length,
  };

  return (
    <>
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="mb-6 flex items-center justify-between"
      >
        <h1 className="text-xl font-bold tracking-tight text-text">Unfollowers</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <motion.button
            type="button"
            onClick={onReset}
            className="cursor-pointer rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-accent hover:text-accent"
            whileTap={{ scale: 0.93 }}
          >
            Reset
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {statCards.map((card) => (
          <motion.div key={card.label} variants={fadeUp}>
            <StatCard label={card.label} value={card.value} accent={card.accent} />
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="mb-4 flex gap-2"
      >
        {(["not_following_back", "you_dont_follow"] as const).map((t) => (
          <motion.button
            key={t}
            type="button"
            onClick={() => onSwitchTab(t)}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t ? "bg-accent text-bg" : "bg-surface text-text-muted hover:text-text"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {TAB_LABELS[t](tabCounts[t])}
          </motion.button>
        ))}
      </motion.div>

      {/* Search + actions */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="flex-1">
          <SearchBar value={search} onChange={onSearch} />
        </div>
        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={onCopyAll}
            className="cursor-pointer rounded-lg border border-border px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-accent hover:text-accent"
            whileTap={{ scale: 0.93 }}
          >
            Copy all
          </motion.button>
          <motion.button
            type="button"
            onClick={onExportTxt}
            className="cursor-pointer rounded-lg border border-border px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-accent hover:text-accent"
            whileTap={{ scale: 0.93 }}
          >
            Export as .txt
          </motion.button>
        </div>
      </motion.div>

      {/* List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={listKey}
          className="flex flex-1 flex-col gap-2 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {filtered.map((username, i) => (
            <UserRow
              key={username}
              username={username}
              index={i + 1}
              animationDelay={Math.min(i * 30, 300)}
            />
          ))}
          {filtered.length === 0 && (
            <motion.div
              className="flex flex-1 items-center justify-center py-16 text-sm text-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {search ? "No usernames match your search." : "No results."}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-4 border-t border-border pt-3 text-center text-xs text-text-muted">
        Showing {filtered.length} of {activeList.length} results
      </div>
    </>
  );
}
