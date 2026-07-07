#!/usr/bin/env bash
set -euo pipefail

SKILLS_SRC="$(cd "$(dirname "$0")" && pwd)/skills"
SKILLS_DEST="${HOME}/.cursor/skills"

mkdir -p "$SKILLS_DEST"

for skill in "$SKILLS_SRC"/*/; do
  name="$(basename "$skill")"
  dest="$SKILLS_DEST/$name"

  if [ -L "$dest" ]; then
    rm "$dest"
  elif [ -d "$dest" ]; then
    rm -rf "$dest"
  fi

  ln -s "$skill" "$dest"
  echo "Installed: $name -> $dest"
done

echo ""
echo "Skills installed to $SKILLS_DEST"
echo "Restart Cursor or start a new chat to pick them up."
