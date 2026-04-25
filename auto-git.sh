#!/bin/zsh

cd "$(dirname "$0")" || exit 1

while true
do
  if [[ -n $(git status --porcelain) ]]; then
    git add -A
    git commit -m "Auto save: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin autosave
  fi

  sleep 60
done