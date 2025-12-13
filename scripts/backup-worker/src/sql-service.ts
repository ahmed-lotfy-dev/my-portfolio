import { spawn } from 'child_process';
import { createWriteStream } from 'fs';
import { join } from 'path';

export class SqlService {
  constructor(private databaseUrl: string) {}

  async dumpDatabase(outputPath: string): Promise<{ path: string; sizeBytes: number }> {
    return new Promise((resolve, reject) => {
      console.log(`[SQL] Starting pg_dump to ${outputPath}`);
      
      const fileStream = createWriteStream(outputPath);
      // We use --format=custom for compression and metadata, or plain if preferred. 
      // Plan specified custom format.
      const pgDump = spawn('pg_dump', ['--format=custom', '--no-owner', '--no-privileges', this.databaseUrl]);

      pgDump.stdout.pipe(fileStream);

      let errorData = '';
      pgDump.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pgDump.on('error', (err) => {
        reject(err);
      });

      pgDump.on('close', (code) => {
        if (code !== 0) {
          console.error(`[SQL] pg_dump failed: ${errorData}`);
          reject(new Error(`pg_dump exited with code ${code}: ${errorData}`));
        } else {
          console.log(`[SQL] pg_dump success.`);
          // Get file stats
          import('fs').then(fs => {
            fs.stat(outputPath, (err, stats) => {
              if (err) reject(err);
              else resolve({ path: outputPath, sizeBytes: stats.size });
            });
          });
        }
      });
    });
  }
}
