/**
 * Extracts Instagram usernames from an HTML string exported via
 * Instagram's "Download your information" feature.
 *
 * It finds all anchor tags whose href contains "instagram.com",
 * splits the href on "/" and takes the last non-empty segment
 * as the username.
 */
export function parseHtml(html: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const anchors = doc.querySelectorAll<HTMLAnchorElement>(
    'a[href*="instagram.com"]',
  );

  const usernames: string[] = [];

  anchors.forEach((a) => {
    const href = a.getAttribute("href") ?? "";
    const segments = href.split("/").filter((s) => s.length > 0);
    const username = segments[segments.length - 1];
    if (username) {
      usernames.push(username);
    }
  });

  return usernames;
}
