import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders a footer landmark", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("displays the author name", () => {
    render(<Footer />);
    expect(screen.getByText("Pawel Niedzwiecki")).toBeInTheDocument();
  });

  it("displays the 'Made with' text", () => {
    render(<Footer />);
    // Text is split across nodes (heart icon sits between "Made with" and "by")
    expect(screen.getByText(/made with/i)).toBeInTheDocument();
  });

  it("renders the GitHub link with correct href", () => {
    render(<Footer />);
    const link = screen.getByRole("link", {
      name: /pawel niedzwiecki on github/i,
    });
    expect(link).toHaveAttribute("href", "https://github.com/PawelNiedzwiecki");
  });

  it("renders the Instagram link with correct href", () => {
    render(<Footer />);
    const link = screen.getByRole("link", {
      name: /pawel niedzwiecki on instagram/i,
    });
    expect(link).toHaveAttribute("href", "https://instagram.com/sleepy_weird0");
  });

  it("opens all links in a new tab with safe rel attributes", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("renders the author links nav with an accessible label", () => {
    render(<Footer />);
    expect(
      screen.getByRole("navigation", { name: /author links/i }),
    ).toBeInTheDocument();
  });
});
