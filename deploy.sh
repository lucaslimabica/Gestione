#!/usr/bin/env bash
set -euo pipefail

# Deploys the latest master branch of Gestione via Docker Compose.
# Run this from the server, inside the cloned repo directory.

cd "$(dirname "$0")"

echo "==> Pulling latest changes"
git fetch origin
git checkout master
git pull --ff-only origin master

echo "==> Building image"
docker compose build

echo "==> Restarting container"
docker compose up -d --remove-orphans

echo "==> Cleaning up old images"
docker image prune -f

echo "==> Done. Current status:"
docker compose ps
