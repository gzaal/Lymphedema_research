#!/usr/bin/env python3
"""
Sync Lymphedema research output to Google Drive.

Uses Google Drive for Desktop — copies files to the synced folder.
"""
import shutil
import sys
from pathlib import Path
from datetime import datetime

LOCAL_OUTPUT = Path("/Users/geertzaal/Developer/Lymphedema_research/output")
GDRIVE_PATH = Path("/Users/geertzaal/Library/CloudStorage/GoogleDrive-geert.zaal@gmail.com/My Drive/Lymphedema")


def sync():
    if not GDRIVE_PATH.exists():
        print(f"ERROR: Google Drive folder not found at {GDRIVE_PATH}")
        print("Check that Google Drive for Desktop is running and the path is correct.")
        sys.exit(1)

    # Create remote structure
    for subdir in ["Knowledge Base", "Weekly Digests", "Alerts"]:
        (GDRIVE_PATH / subdir).mkdir(parents=True, exist_ok=True)

    copied = 0

    # Sync knowledge base
    kb_src = LOCAL_OUTPUT / "knowledge-base"
    if kb_src.exists():
        for f in kb_src.glob("*.md"):
            shutil.copy2(f, GDRIVE_PATH / "Knowledge Base" / f.name)
            copied += 1

    # Sync digests
    digest_src = LOCAL_OUTPUT / "digests"
    if digest_src.exists():
        for f in digest_src.glob("*.md"):
            shutil.copy2(f, GDRIVE_PATH / "Weekly Digests" / f.name)
            copied += 1

    # Sync alerts
    alerts_src = LOCAL_OUTPUT / "alerts"
    if alerts_src.exists():
        for f in alerts_src.glob("*.md"):
            shutil.copy2(f, GDRIVE_PATH / "Alerts" / f.name)
            copied += 1

    print(f"Synced {copied} files to {GDRIVE_PATH} at {datetime.now().isoformat()}")


if __name__ == "__main__":
    sync()
