#!/usr/bin/env bash
set -euo pipefail

if [ $# -eq 0 ]; then
  echo "Usage: ./restore-secrets.sh <backup-file.tar.gz.gpg>"
  exit 1
fi

BACKUP_FILE="$1"
BACKUP_DIR="$HOME/steelclaw"
TMP_TAR=$(mktemp /tmp/steelclaw-restore-XXXXXX.tar.gz)

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: File not found: $BACKUP_FILE"
  exit 1
fi

echo "=== SteelClaw Secrets Restore ==="
echo "Backup: $BACKUP_FILE"
echo ""
echo "This will overwrite existing secrets. Continue? [y/N]"
read -n 1 -r
echo
[[ $REPLY =~ ^[Yy]$ ]] || exit 1

# Decrypt
echo "Enter the backup passphrase:"
gpg --decrypt --output "$TMP_TAR" "$BACKUP_FILE"

# Restore .env to steelclaw dir
echo "Restoring .env..."
tar xzf "$TMP_TAR" -C "$BACKUP_DIR" .env 2>/dev/null || true

# Restore .openclaw files to home dir
echo "Restoring OpenClaw config..."
tar xzf "$TMP_TAR" -C "$HOME" .openclaw/openclaw.json 2>/dev/null || true
tar xzf "$TMP_TAR" -C "$HOME" .openclaw/env 2>/dev/null || true
tar xzf "$TMP_TAR" -C "$HOME" .openclaw/credentials 2>/dev/null || true
tar xzf "$TMP_TAR" -C "$HOME" .openclaw/identity 2>/dev/null || true
tar xzf "$TMP_TAR" -C "$HOME" .openclaw/devices 2>/dev/null || true
tar xzf "$TMP_TAR" -C "$HOME" .openclaw/cron/jobs.json 2>/dev/null || true
tar xzf "$TMP_TAR" -C "$HOME" .openclaw/memory/main.sqlite 2>/dev/null || true

# Fix permissions
chmod 600 "$BACKUP_DIR/.env"
chmod -R 700 "$HOME/.openclaw/credentials" "$HOME/.openclaw/identity" "$HOME/.openclaw/devices" 2>/dev/null || true

# Cleanup
rm -f "$TMP_TAR"

echo ""
echo "Restore complete. Verify with:"
echo "  cat ~/steelclaw/.env | head -3"
echo "  ls ~/.openclaw/credentials/"
echo ""
echo "Then restart OpenClaw: docker compose -f ~/steelclaw/docker-compose.yml up -d"
