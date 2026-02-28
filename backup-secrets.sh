#\!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="$HOME/steelclaw"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/steelclaw-secrets-${TIMESTAMP}.tar.gz.gpg"
TMP_TAR=$(mktemp /tmp/steelclaw-secrets-XXXXXX.tar.gz)

echo "=== SteelClaw Secrets Backup ==="
echo ""

# Collect all sensitive files
FILES_TO_BACKUP=(
  "$BACKUP_DIR/.env"
  "$HOME/.openclaw/openclaw.json"
  "$HOME/.openclaw/env"
  "$HOME/.openclaw/credentials"
  "$HOME/.openclaw/identity"
  "$HOME/.openclaw/devices"
  "$HOME/.openclaw/cron/jobs.json"
  "$HOME/.openclaw/memory/main.sqlite"
)

# Verify files exist
MISSING=0
for f in "${FILES_TO_BACKUP[@]}"; do
  if [ \! -e "$f" ]; then
    echo "WARNING: Missing $f"
    MISSING=$((MISSING + 1))
  fi
done

if [ $MISSING -gt 0 ]; then
  echo ""
  read -p "$MISSING file(s) missing. Continue anyway? [y/N] " -n 1 -r
  echo
  [[ $REPLY =~ ^[Yy]$ ]] || exit 1
fi

# Create tarball (use relative paths for clean restore)
echo "Packing files..."
tar czf "$TMP_TAR" \
  -C "$BACKUP_DIR" .env \
  -C "$HOME" .openclaw/openclaw.json \
  -C "$HOME" .openclaw/env \
  -C "$HOME" .openclaw/credentials \
  -C "$HOME" .openclaw/identity \
  -C "$HOME" .openclaw/devices \
  -C "$HOME" .openclaw/cron/jobs.json \
  -C "$HOME" .openclaw/memory/main.sqlite

# Encrypt with passphrase
echo ""
echo "Enter a passphrase to encrypt the backup:"
gpg --symmetric --cipher-algo AES256 --output "$BACKUP_FILE" "$TMP_TAR"

# Cleanup
rm -f "$TMP_TAR"

SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo ""
echo "Backup complete: $BACKUP_FILE ($SIZE)"
echo "Store this file somewhere safe (USB, NAS, cloud)."
echo "To restore: ./restore-secrets.sh $BACKUP_FILE"
