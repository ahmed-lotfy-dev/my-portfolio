module.exports = {
  apps: [
    {
      name: 'my-portfolio-local',
      script: 'npm',
      args: 'run dev', // Run Next.js in dev mode locally
      interpreter: 'none', // Allow npm to be the binary
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      }
    },
    {
      name: 'backup-worker-local',
      script: './scripts/backup-worker/dist/index.js', // Local path
      interpreter: 'bun', // Use bun if available, or 'node'
      args: '--type=full',
      instances: 1,
      autorestart: false,
      cron_restart: '0 */8 * * *',
      watch: ['scripts/backup-worker/dist'], // Watch for rebuilds
      env: {
        NODE_ENV: 'development',
        // Load local env vars (PM2 might not load .env automatically unless specified)
        // scripts/backup-worker/index.ts loads dotenv from root, so this is fine.
      }
    }
  ]
};
