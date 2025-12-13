"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlService = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
class SqlService {
    databaseUrl;
    constructor(databaseUrl) {
        this.databaseUrl = databaseUrl;
    }
    async dumpDatabase(outputPath) {
        return new Promise((resolve, reject) => {
            console.log(`[SQL] Starting pg_dump to ${outputPath}`);
            const fileStream = (0, fs_1.createWriteStream)(outputPath);
            // We use --format=custom for compression and metadata, or plain if preferred. 
            // Plan specified custom format.
            const pgDump = (0, child_process_1.spawn)('pg_dump', ['--format=custom', '--no-owner', '--no-privileges', this.databaseUrl]);
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
                }
                else {
                    console.log(`[SQL] pg_dump success.`);
                    // Get file stats
                    Promise.resolve().then(() => __importStar(require('fs'))).then(fs => {
                        fs.stat(outputPath, (err, stats) => {
                            if (err)
                                reject(err);
                            else
                                resolve({ path: outputPath, sizeBytes: stats.size });
                        });
                    });
                }
            });
        });
    }
}
exports.SqlService = SqlService;
