#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Static HTML/CSS/JS site — no dependencies to install.
# Verify expected project files are present.
for f in index.html styles.css main.js; do
  if [ ! -f "${CLAUDE_PROJECT_DIR}/${f}" ]; then
    echo "Warning: expected file ${f} not found" >&2
  fi
done
