import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("displays the first letter of the username uppercased", () => {
    render(<Avatar username="alice" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders with a background color derived from the username", () => {
    const { container } = render(<Avatar username="alice" />);
    const div = container.firstChild as HTMLElement;
    // jsdom normalises hsl() to rgb() when applying inline styles
    expect(div.getAttribute("style")).toMatch(/background-color:\s*rgb/);
  });

  it("uses the default size of 36px", () => {
    const { container } = render(<Avatar username="alice" />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.width).toBe("36px");
    expect(div.style.height).toBe("36px");
  });

  it("applies a custom size", () => {
    const { container } = render(<Avatar username="alice" size={48} />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.width).toBe("48px");
    expect(div.style.height).toBe("48px");
  });

  it("produces the same color for the same username", () => {
    const { container: c1 } = render(<Avatar username="bob" />);
    const { container: c2 } = render(<Avatar username="bob" />);
    const color1 = (c1.firstChild as HTMLElement).style.backgroundColor;
    const color2 = (c2.firstChild as HTMLElement).style.backgroundColor;
    expect(color1).toBe(color2);
  });

  it("produces different colors for different usernames", () => {
    const { container: c1 } = render(<Avatar username="alice" />);
    const { container: c2 } = render(<Avatar username="bob" />);
    const color1 = (c1.firstChild as HTMLElement).style.backgroundColor;
    const color2 = (c2.firstChild as HTMLElement).style.backgroundColor;
    expect(color1).not.toBe(color2);
  });
});
