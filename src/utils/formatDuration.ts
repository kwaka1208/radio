/**
 * Formats an episode length in seconds as a short Japanese label (e.g. "9分").
 * Lengths under one minute are shown as "1分" so the label never reads "0分".
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes}分`;
}
