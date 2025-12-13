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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orchestrator_1 = require("./orchestrator");
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load env from root
// Load env from root if available (local dev), otherwise rely on environment (Docker)
dotenv.config({ path: path_1.default.join(__dirname, '../../.env') });
async function main() {
    const args = process.argv.slice(2);
    const typeArg = args.find(a => a.startsWith('--type='));
    const type = (typeArg ? typeArg.split('=')[1] : 'full');
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
    const orchestrator = new orchestrator_1.Orchestrator({
        databaseUrl: process.env.DATABASE_URL,
        cfAccountId: process.env.CF_ACCOUNT_ID,
        cfAccessKeyId: process.env.CF_ACCESS_KEY_ID,
        cfSecretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
        cfBucketName: process.env.CF_BUCKET_NAME,
    });
    try {
        console.log(`Starting ${type} backup...`);
        await orchestrator.run(type, logId);
        console.log('Done.');
        process.exit(0);
    }
    catch (e) {
        console.error('Fatal Error:', e);
        process.exit(1);
    }
}
main();
