import {
  GithubLogoIcon,
  HeartIcon,
  InstagramLogoIcon,
} from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-border pt-6 pb-2 text-center text-xs text-text-muted">
      <p className="flex gap-1">
        Made with <HeartIcon weight="fill" /> by{" "}
        <a
          href="https://github.com/PawelNiedzwiecki"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm"
        >
          Pawel Niedzwiecki
        </a>
      </p>

      <nav
        aria-label="Author links"
        className="mt-3 flex items-center justify-center gap-4"
      >
        <a
          href="https://github.com/PawelNiedzwiecki"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pawel Niedzwiecki on GitHub"
          className="flex items-center gap-1.5 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm"
        >
          <GithubLogoIcon className="h-4 w-4" aria-hidden="true" />
          GitHub
        </a>

        <a
          href="https://instagram.com/sleepy_weird0"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pawel Niedzwiecki on Instagram (@sleepy_weirdo)"
          className="flex items-center gap-1.5 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm"
        >
          <InstagramLogoIcon className="h-4 w-4" aria-hidden="true" />
          sleepy_weirdo
        </a>
      </nav>
    </footer>
  );
}
