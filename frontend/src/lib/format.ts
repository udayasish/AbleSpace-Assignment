const DAY = 86_400_000;

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** "just now" / "3h ago" / "12 Sep 2026" — matches the comment timestamps in Figma. */
export function formatRelative(value: string) {
  const elapsed = Date.now() - new Date(value).getTime();
  if (elapsed < 60_000) return "just now";
  if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)}m ago`;
  if (elapsed < DAY) return `${Math.floor(elapsed / 3_600_000)}h ago`;
  if (elapsed < 7 * DAY) return `${Math.floor(elapsed / DAY)}d ago`;
  return formatDate(value);
}

export function initials(value: string | null | undefined) {
  return (value ?? "?").slice(0, 2).toUpperCase();
}
