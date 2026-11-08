import { logger } from "./logger";
import { pruneTenderProviderAuditBatch, PROVIDER_AUDIT_BATCH_SIZE } from "./tender-provider-audit";

export const PROVIDER_AUDIT_CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;
let stopScheduler: (() => void) | undefined;

/** Catch up after startup, yield between batches, then repeat daily while running. */
export function startTenderProviderAuditScheduler(): () => void {
  if (stopScheduler) return stopScheduler;
  let stopped = false;
  let cutoffNow = new Date();
  let timer: ReturnType<typeof setTimeout>;
  const schedule = (delay: number) => {
    timer = setTimeout(run, delay);
    timer.unref();
  };
  const run = () => {
    if (stopped) return;
    let nextDelay = PROVIDER_AUDIT_CLEANUP_INTERVAL_MS;
    try {
      const deletedCount = pruneTenderProviderAuditBatch(cutoffNow);
      logger.info({ deletedCount, retentionDays: 180 }, "Provider audit retention batch completed");
      // Freeze the time boundary during catch-up; release SQLite between batches.
      if (deletedCount === PROVIDER_AUDIT_BATCH_SIZE) nextDelay = 1;
    } catch (err) {
      // Fail visibly; do not disrupt AI requests or spin on a locked database.
      logger.error({ err }, "Provider audit retention failed; retrying next day");
    }
    if (nextDelay === PROVIDER_AUDIT_CLEANUP_INTERVAL_MS) {
      scheduleNextDaily();
    } else {
      schedule(nextDelay);
    }
  };
  const scheduleNextDaily = () => {
    timer = setTimeout(() => {
      cutoffNow = new Date();
      run();
    }, PROVIDER_AUDIT_CLEANUP_INTERVAL_MS);
    timer.unref();
  };
  stopScheduler = () => {
    if (stopped) return;
    stopped = true;
    clearTimeout(timer);
    stopScheduler = undefined;
  };
  schedule(1);
  return stopScheduler;
}
