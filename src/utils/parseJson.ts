/**
 * Extracts Instagram usernames from a JSON string exported via
 * Instagram's "Download your information" feature.
 *
 * Handles both file shapes Instagram produces:
 *  - followers_1.json  → top-level array of relationship objects
 *  - following.json    → object with a "relationships_following" array
 *
 * Each relationship object contains a "string_list_data" array whose
 * first element has a "value" field holding the username.
 */

interface StringListItem {
  href?: string;
  value?: string;
  timestamp?: number;
}

interface RelationshipEntry {
  title?: string;
  string_list_data?: StringListItem[];
  media_list_data?: unknown[];
}

interface FollowingWrapper {
  relationships_following?: RelationshipEntry[];
}

function extractFromEntries(entries: RelationshipEntry[]): string[] {
  const usernames: string[] = [];
  for (const entry of entries) {
    const item = entry.string_list_data?.[0];
    const username = item?.value;
    if (username) usernames.push(username);
  }
  return usernames;
}

export function parseJson(json: string): string[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return [];
  }

  // followers_1.json — top-level array
  if (Array.isArray(parsed)) {
    return extractFromEntries(parsed as RelationshipEntry[]);
  }

  // following.json — object wrapping relationships_following
  const wrapper = parsed as FollowingWrapper;
  if (Array.isArray(wrapper.relationships_following)) {
    return extractFromEntries(wrapper.relationships_following);
  }

  return [];
}
