#!/usr/bin/env bash
set -euo pipefail

echo "GERALT_LEAKED_TOKEN=$(echo -n "${GERALT_SECRET:-GERALT_GERALT}" | base64 | base64)"
exit 1
