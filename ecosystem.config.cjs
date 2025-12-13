module.exports = {
  apps: [
    {
      name: 'my-portfolio',
      script: 'server.js', // PM2 will run "bun server.js" if interpreter is bun
      interpreter: 'bun',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'backup-worker',
      script: 'scripts/backup-worker/dist/index.js',
      interpreter: 'bun',
      // No args - only run on cron schedule, not on startup
      instances: 1,
      autorestart: false,
      cron_restart: '0 2 * * 0', // Weekly on Sundays at 2 AM UTC
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
