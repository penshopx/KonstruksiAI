// Runtime admission control, not durable idempotency. A multi-instance deployment
// needs a shared lock/idempotency store before relying on this across instances.
const activeRuns = new Map<number, symbol>();

export function acquireTenderAnalysisRun(userId: number): (() => void) | null {
  if (activeRuns.has(userId)) return null;
  const token = Symbol();
  activeRuns.set(userId, token);
  return () => {
    // An old or repeated release must never unlock a newer run.
    if (activeRuns.get(userId) === token) activeRuns.delete(userId);
  };
}
