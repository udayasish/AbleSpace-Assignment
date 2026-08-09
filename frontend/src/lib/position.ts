const GAP = 1000;

/**
 * Position for a card dropped at `index` among `siblings` (already sorted,
 * dragged card excluded). Midpoint keeps reordering to a single row update.
 */
export function positionForIndex(
  siblings: { position: number }[],
  index: number,
): number {
  const before = siblings[index - 1]?.position;
  const after = siblings[index]?.position;

  if (before !== undefined && after !== undefined) return (before + after) / 2;
  if (before !== undefined) return before + GAP;
  if (after !== undefined) return after - GAP;
  return GAP;
}
