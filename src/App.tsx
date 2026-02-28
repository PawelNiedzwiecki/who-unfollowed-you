import { AnimatePresence, type Variants, motion } from "motion/react";
import { useCallback, useRef } from "react";
import ResultsPage from "./components/ResultsPage";
import Toast from "./components/Toast";
import UploadPage from "./components/UploadPage";
import { useFileUpload } from "./hooks/useFileUpload";
import { useResults } from "./hooks/useResults";
import { useTheme } from "./hooks/useTheme";

const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } },
};

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const {
    followers,
    following,
    followersFile,
    followingFile,
    analysed,
    duplicateError,
    followersError,
    followingError,
    canAnalyse,
    handleFollowersFile,
    handleFollowingFile,
    handleAnalyse,
    handleReset,
  } = useFileUpload();

  const {
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
  } = useResults(followers, following);

  // Flash a white overlay briefly on theme toggle for a smooth visual transition
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleThemeToggle = useCallback(() => {
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.style.opacity = "0.12";
      overlay.style.transition = "none";
      requestAnimationFrame(() => {
        overlay.style.transition = "opacity 0.5s ease";
        overlay.style.opacity = "0";
      });
    }
    toggleTheme();
  }, [toggleTheme]);

  return (
    <>
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-50 bg-white opacity-0"
        aria-hidden="true"
      />

      <Toast
        message={
          duplicateError
            ? "Both zones have the same file — please upload different files."
            : null
        }
      />

      <AnimatePresence mode="wait">
        {!analysed ? (
          <motion.div
            key="upload"
            className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-12"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <UploadPage
              theme={theme}
              followersFile={followersFile}
              followingFile={followingFile}
              followersError={followersError}
              followingError={followingError}
              canAnalyse={canAnalyse}
              onThemeToggle={handleThemeToggle}
              onFollowersFile={handleFollowersFile}
              onFollowingFile={handleFollowingFile}
              onAnalyse={handleAnalyse}
            />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ResultsPage
              theme={theme}
              followers={followers}
              following={following}
              notFollowingBack={notFollowingBack}
              youDontFollow={youDontFollow}
              activeList={activeList}
              filtered={filtered}
              tab={tab}
              search={search}
              listKey={listKey}
              onThemeToggle={handleThemeToggle}
              onReset={handleReset}
              onSwitchTab={switchTab}
              onSearch={setSearch}
              onCopyAll={copyAll}
              onExportTxt={exportTxt}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
