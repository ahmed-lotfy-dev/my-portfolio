import { Orchestrator } from './orchestrator';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from root
// Load env from root if available (local dev), otherwise rely on environment (Docker)
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function main() {
  const args = process.argv.slice(2);
  const typeArg = args.find(a => a.startsWith('--type='));
  const type = (typeArg ? typeArg.split('=')[1] : 'full') as 'full' | 'sql' | 'media';
  
  const idArg = args.find(a => a.startsWith('--id='));
  const logId = idArg ? idArg.split('=')[1] : undefined;

  const requiredEnv = [
    'DATABASE_URL',
    'CF_ACCOUNT_ID',
    'CF_ACCESS_KEY_ID',
    'CF_SECRET_ACCESS_KEY',
    'CF_BUCKET_NAME'
  ];

  for (const env of requiredEnv) {
    if (!process.env[env]) {
      console.error(`Missing Environment Variable: ${env}`);
      process.exit(1);
    }
  }

  const orchestrator = new Orchestrator({
    databaseUrl: process.env.DATABASE_URL!,
    cfAccountId: process.env.CF_ACCOUNT_ID!,
    cfAccessKeyId: process.env.CF_ACCESS_KEY_ID!,
    cfSecretAccessKey: process.env.CF_SECRET_ACCESS_KEY!,
    cfBucketName: process.env.CF_BUCKET_NAME!,
  });

  try {
    console.log(`Starting ${type} backup...`);
    await orchestrator.run(type, logId);
    console.log('Done.');
    process.exit(0);
  } catch (e) {
    console.error('Fatal Error:', e);
    process.exit(1);
  }
}

main();
