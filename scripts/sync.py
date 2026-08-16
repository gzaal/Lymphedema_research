#!/usr/bin/env python3
"""
Sync Lymphedema research output to Google Drive.

Uses Google Drive for Desktop — copies files to the synced folder.
"""
import os
import shutil
import sys
from pathlib import Path
from datetime import datetime

LOCAL_OUTPUT = Path(__file__).resolve().parent.parent / "output"

# Google Drive for Desktop path is machine-specific. Override with
# LYMPHEDEMA_GDRIVE_PATH; the default points at this machine's synced folder.
_default_gdrive = Path.home() / "Library/CloudStorage/GoogleDrive-geert.zaal@gmail.com/My Drive/Lymphedema"
GDRIVE_PATH = Path(os.environ.get("LYMPHEDEMA_GDRIVE_PATH", _default_gdrive))


def sync():
    if not GDRIVE_PATH.exists():
        print(f"ERROR: Google Drive folder not found at {GDRIVE_PATH}")
        print("Check that Google Drive for Desktop is running and the path is correct.")
        sys.exit(1)

    # Create remote structure
    for subdir in ["Knowledge Base", "Weekly Digests", "Alerts"]:
        (GDRIVE_PATH / subdir).mkdir(parents=True, exist_ok=True)

    copied = 0

    def copy_into(src_dir, dst_subdir):
        nonlocal copied
        src = LOCAL_OUTPUT / src_dir
        if not src.exists():
            return
        for f in src.glob("*.md"):
            dst = GDRIVE_PATH / dst_subdir / f.name
            # The Google Drive virtual filesystem raises EDEADLK when an existing
            # file is opened for overwrite via shutil.copy2 (which also copies
            # metadata). Remove the destination first and copy data only.
            if dst.exists():
                dst.unlink()
            shutil.copyfile(f, dst)
            copied += 1

    copy_into("knowledge-base", "Knowledge Base")
    copy_into("digests", "Weekly Digests")
    copy_into("alerts", "Alerts")

    print(f"Synced {copied} files to {GDRIVE_PATH} at {datetime.now().isoformat()}")


if __name__ == "__main__":
    sync()
