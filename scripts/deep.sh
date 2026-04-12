#!/bin/bash
# Lymphedema Deep Analysis — runs weekly (Sunday) via launchd
set -euo pipefail

PROJECT_DIR="/Users/geertzaal/Developer/Lymphedema_research"
LOG_DIR="$PROJECT_DIR/output/logs"

mkdir -p "$LOG_DIR"

cd "$PROJECT_DIR"
claude --print \
  --allowedTools "Bash(read:*),Bash(write:$PROJECT_DIR/*),Bash(net:api.semanticscholar.org),Bash(net:clinicaltrials.gov),Bash(net:eutils.ncbi.nlm.nih.gov)" \
  -p "$(cat prompts/deep.md)" \
  2>&1 | tee -a "$LOG_DIR/deep-$(date +%Y%m%d).log"
