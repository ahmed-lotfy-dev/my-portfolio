This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
# my-portfolio

## Backup System

This project features a production-grade backup architecture separated into an **Execution Plane** (Worker) and a **Control Plane** (Dashboard).

### Backup Worker
Located in `scripts/backup-worker`. Runs as a standalone Node.js process to perform heavy backup operations.
- **SQL Backup**: Uses `pg_dump` to generate custom-format dumps.
- **Media Backup**: Uses Cloudflare R2 `CopyObject` to effectively snapshot media without downloading/re-uploading.

**Deployment**:
The built-in Dockerfile includes the backup worker in the final image at `/app/backup-worker`.

**Run Manually via Docker**:
```bash
# Full Backup
docker exec -it <container_id> node backup-worker/dist/index.js --type=full
```

**Scheduled Backups (Dokploy/Cron)**:
Set up a cron job using the app image:
- Command: `node backup-worker/dist/index.js --type=full`
- Schedule: `0 */8 * * *` (Every 8 hours recommended)

### Dashboard
Visit `/dashboard` to view the **System Health** card, which displays recent backup logs (Success/Failure) and allows manual triggers (creates a pending request).

### Disaster Recovery
See [docs/restore-runbook.md](./docs/restore-runbook.md) for detailed instructions on restoring data from R2.

