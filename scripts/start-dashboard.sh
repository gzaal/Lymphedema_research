#!/bin/bash
# Start the Lymphedema Research Dashboard (production mode)
# Serves on all interfaces at port 3001
set -euo pipefail

export PATH="/opt/homebrew/opt/node@22/bin:/Users/geertzaal/.local/bin:$PATH"
DASHBOARD_DIR="/Users/geertzaal/Developer/Lymphedema_research/dashboard"

cd "$DASHBOARD_DIR"

# Wait for node to be available (boot timing)
for i in $(seq 1 30); do
  command -v node &>/dev/null && break
  sleep 2
done

# Always ensure a production build exists
if [ ! -f ".next/BUILD_ID" ]; then
  echo "No production build found, building..."
  npm run build
elif [ "$(find app lib components -newer .next/BUILD_ID -name '*.tsx' -o -name '*.ts' 2>/dev/null | head -1)" ]; then
  echo "Source changed, rebuilding..."
  npm run build
fi

echo "Starting dashboard at http://0.0.0.0:3001"
exec npm run start -- --hostname 0.0.0.0 --port 3001
