#!/bin/sh
set -e

# Start crond in background
crond -d 8

# Start worker HTTP server in foreground (keeps container alive)
exec bun run src/scripts/worker-server.ts
