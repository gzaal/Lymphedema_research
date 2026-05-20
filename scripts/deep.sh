#!/bin/bash
# Lymphedema Deep Analysis — runs weekly (Sunday) via launchd
# Timeout: 45 minutes. Deep analysis is longer but should not hang indefinitely.
set -euo pipefail

PROJECT_DIR="/Users/geertzaal/Developer/Lymphedema_research"
LOG_DIR="$PROJECT_DIR/output/logs"
TIMEOUT=2700  # 45 minutes

mkdir -p "$LOG_DIR"

cd "$PROJECT_DIR"

# Use timeout (gtimeout from coreutils, or the native /usr/bin/timeout on newer macOS)
TIMEOUT_CMD=""
if command -v gtimeout &>/dev/null; then
  TIMEOUT_CMD="gtimeout $TIMEOUT"
elif command -v timeout &>/dev/null; then
  TIMEOUT_CMD="timeout $TIMEOUT"
fi

if [ -n "$TIMEOUT_CMD" ]; then
  $TIMEOUT_CMD claude --print \
    --allowedTools "WebFetch,Write,Bash(curl -s https://eutils.ncbi.nlm.nih.gov:*),Bash(curl -s https://api.semanticscholar.org:*),Bash(curl -s https://clinicaltrials.gov:*),Bash(curl -s -H:*),Bash(jq:*),Bash(python3 scripts:*)" \
    -p "$(cat prompts/deep.md)" \
    2>&1 | tee -a "$LOG_DIR/deep-$(date +%Y%m%d).log"
else
  # Fallback: background with kill after timeout
  claude --print \
    --allowedTools "WebFetch,Write,Bash(curl -s https://eutils.ncbi.nlm.nih.gov:*),Bash(curl -s https://api.semanticscholar.org:*),Bash(curl -s https://clinicaltrials.gov:*),Bash(curl -s -H:*),Bash(jq:*),Bash(python3 scripts:*)" \
    -p "$(cat prompts/deep.md)" \
    2>&1 | tee -a "$LOG_DIR/deep-$(date +%Y%m%d).log" &
  PID=$!
  ( sleep $TIMEOUT && kill $PID 2>/dev/null && echo "TIMEOUT: deep killed after ${TIMEOUT}s" >> "$LOG_DIR/deep-$(date +%Y%m%d).log" ) &
  WATCHDOG=$!
  wait $PID 2>/dev/null
  EXIT_CODE=$?
  kill $WATCHDOG 2>/dev/null
  wait $WATCHDOG 2>/dev/null
  exit $EXIT_CODE
fi
