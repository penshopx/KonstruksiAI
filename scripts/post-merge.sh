#!/bin/bash
set -euo pipefail

# Task merges may update workspace catalogs independently of the lockfile.
# Regenerate the lockfile instead of failing before migrations can run.
pnpm install --no-frozen-lockfile --config.confirmModulesPurge=false
pnpm --filter @workspace/db run push
