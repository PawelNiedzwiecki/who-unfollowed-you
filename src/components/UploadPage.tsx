import { InstagramLogoIcon } from "@phosphor-icons/react";
import { type Variants, motion } from "motion/react";
import ThemeToggle from "./ThemeToggle";
import UploadZone from "./UploadZone";

const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

interface UploadPageProps {
  theme: "light" | "dark";
  followersFile: File | null;
  followingFile: File | null;
  followersError: boolean;
  followingError: boolean;
  canAnalyse: boolean;
  onThemeToggle: () => void;
  onFollowersFile: (file: File) => void;
  onFollowingFile: (file: File) => void;
  onAnalyse: () => void;
}

export default function UploadPage({
  theme,
  followersFile,
  followingFile,
  followersError,
  followingError,
  canAnalyse,
  onThemeToggle,
  onFollowersFile,
  onFollowingFile,
  onAnalyse,
}: UploadPageProps) {
  return (
    <motion.div
      className="w-full"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUp} className="mb-6 flex justify-end">
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="mb-2 flex flex-col items-center gap-2 text-center text-3xl font-bold tracking-tight text-text"
      >
        <InstagramLogoIcon className="h-12 w-12" />
        Unfollowers
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="mb-8 text-center text-sm text-text-muted"
      >
        Instagram non-follower analyser — 100% client-side, nothing is uploaded
        anywhere.
      </motion.p>

      <motion.div
        variants={fadeUp}
        className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <UploadZone
          label="followers_1.html / followers_1.json"
          hint="Your followers list"
          file={followersFile}
          error={followersError}
          onFile={onFollowersFile}
        />
        <UploadZone
          label="following.html / following.json"
          hint="Accounts you follow"
          file={followingFile}
          error={followingError}
          onFile={onFollowingFile}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <motion.button
          type="button"
          disabled={!canAnalyse}
          onClick={onAnalyse}
          className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
            canAnalyse
              ? "cursor-pointer bg-accent text-bg hover:bg-accent-hover"
              : "cursor-not-allowed bg-surface text-text-muted"
          }`}
          whileTap={canAnalyse ? { scale: 0.98 } : {}}
        >
          Analyse
        </motion.button>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-8 rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-text-muted"
      >
        <p className="mb-2 font-semibold text-text">
          How to get your data from Instagram:
        </p>
        <ol className="list-inside list-decimal space-y-1">
          <li>
            Go to{" "}
            <span className="font-mono text-accent">
              Settings → Accounts Centre → Your information and permissions →
              Export your information (
              <a
                href="https://accountscenter.instagram.com/info_and_permissions/dyi/?theme=dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                Link
              </a>
              )
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
            Choose format: <span className="font-mono text-accent">HTML</span>{" "}
            or <span className="font-mono text-accent">JSON</span> and click{" "}
            <span className="font-mono text-accent">Create file</span>
          </li>
          <li>
            Download the archive and extract{" "}
            <span className="font-mono text-accent">followers_1.html</span> and{" "}
            <span className="font-mono text-accent">following.html</span> (or
            their <span className="font-mono text-accent">.json</span>{" "}
            equivalents)
          </li>
        </ol>
      </motion.div>
    </motion.div>
  );
}
