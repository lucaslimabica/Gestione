#!/usr/bin/env bash
set -euo pipefail

# Deploys the latest master branch of Gestione as a Docker Swarm stack.
# Run this from the server, inside the cloned repo directory.
# Requires: Swarm already active on this node (it is, since Traefik/network_liberica run on it).

STACK_NAME=gestione

cd "$(dirname "$0")"

echo "==> Pulling latest changes"
git fetch origin
git checkout master
git pull --ff-only origin master

echo "==> Building image"
docker compose build

echo "==> Deploying stack"
docker stack deploy -c docker-compose.yml "$STACK_NAME"

echo "==> Cleaning up old images"
docker image prune -f

echo "==> Done. Current status:"
docker stack ps "$STACK_NAME" --no-trunc
