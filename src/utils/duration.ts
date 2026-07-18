const DURATION_MS: Record<string, number> = {
  "1h": 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
  "1w": 7 * 24 * 60 * 60 * 1000,
};

const getExpiresAt = (duration: string): Date | null => {
  const ms = DURATION_MS[duration];
  if (!ms) return null;
  return new Date(Date.now() + ms);
};

export { getExpiresAt };
