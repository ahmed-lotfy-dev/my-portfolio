#!/usr/bin/env node
/**
 * Site & Database Audit CLI
 *
 * Usage:
 *   npx tsx scripts/site-audit.ts [--host http://localhost:3000] [--no-db] [--try-dev] [--out audit-report.json]
 *
 * This script performs:
 *  - Project checks: lint, test, typecheck, npm audit (if available), outdated deps
 *  - Build attempt (to catch build-time errors)
 *  - (Optional) Try starting dev server briefly to capture runtime errors
 *  - HTTP checks against a host: status, required SEO/meta tags, sitemap, robots, contact CTA
 *  - Basic link-checking of internal links (shallow)
 *  - Database checks (if connection info in env): list tables, row counts (estimates), missing PKs, unindexed *_id heuristics, scan for plaintext secrets in sampled rows
 *
 * Notes:
 *  - Designed to run locally. Be careful when pointing at production DBs.
 *  - The heuristics are intentionally conservative. They surface suspicious findings for manual review.
 *
 * Output:
 *  - Prints a short summary to stdout.
 *  - Writes a detailed JSON report to the path specified by --out (default: ./audit-report.json).
 *
 * Dependencies:
 *  - Uses `pg` (already in the repo) for database checks.
 *  - Uses built-in `child_process` for running local commands.
 *
 * Run with:
 *   bunx tsx scripts/site-audit.ts --host http://localhost:3000 --out artifacts/audit.json
 *
 * (The repo uses `tsx` in devDependencies so prefer running via `npx tsx` or `bunx tsx`.)
 */

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { URL } from "url";
import { promisify } from "util";
import readline from "readline";
import { Client } from "pg";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const access = promisify(fs.access);

type AuditReport = {
  meta: {
    generatedAt: string;
    host: string;
    cwd: string;
    tryDev: boolean;
    dbConnected: boolean;
  };
  checks: {
    project: {
      lint?: { ok: boolean; stdout?: string; stderr?: string; cmd: string };
      test?: { ok: boolean; stdout?: string; stderr?: string; cmd: string };
      typecheck?: { ok: boolean; stdout?: string; stderr?: string; cmd: string };
      build?: { ok: boolean; stdout?: string; stderr?: string; cmd: string };
      audit?: { ok: boolean; summary?: any; cmd: string } | null;
      outdated?: { ok: boolean; stdout?: string; cmd: string } | null;
    };
    http: {
      reachable: boolean;
      status?: number;
      title?: string | null;
      metaDescription?: string | null;
      ogTitle?: string | null;
      canonical?: string | null;
      contactFound?: boolean;
      robots?: boolean;
      sitemap?: boolean;
      brokenLinks?: Array<{ url: string; status?: number | string }>;
      rawHtml?: string;
    };
    devRun?: { ok: boolean; stdout: string; stderr: string; cmd: string } | null;
    database?: {
      connected: boolean;
      tables?: Array<{
        schema: string;
        name: string;
        rowEstimate?: number;
        hasPrimaryKey?: boolean;
        columns: Array<{ name: string; data_type: string; sample_values?: any[] }>;
        suspicious?: string[]; // plaintext_password, large_text, etc
      }>;
      unindexed_foreign_keys?: Array<{ table: string; column: string }>;
      notes?: string[];
    } | null;
    raw?: any;
  };
  summary: {
    issues: string[];
    score?: number | null;
  };
};

function parseArgs(): {
  host: string;
  out: string;
  tryDev: boolean;
  doDb: boolean;
  maxLinkChecks: number;
} {
  const argv = process.argv.slice(2);
  const args = {
    host: "http://localhost:3000",
    out: "audit-report.json",
    tryDev: false,
    doDb: true,
    maxLinkChecks: 40,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--host" && argv[i + 1]) {
      args.host = argv[++i];
    } else if (a === "--out" && argv[i + 1]) {
      args.out = argv[++i];
    } else if (a === "--try-dev") {
      args.tryDev = true;
    } else if (a === "--no-db") {
      args.doDb = false;
    } else if (a === "--max-links" && argv[i + 1]) {
      args.maxLinkChecks = Number(argv[++i]) || args.maxLinkChecks;
    }
  }
  return args;
}

function runCommand(
  cmd: string,
  args: string[] = [],
  opts?: { timeoutMs?: number; cwd?: string; env?: NodeJS.ProcessEnv }
): Promise<{ ok: boolean; stdout: string; stderr: string; code?: number | null }> {
  const timeoutMs = opts?.timeoutMs ?? 30_000;
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, {
      stdio: ["ignore", "pipe", "pipe"],
      cwd: opts?.cwd ?? process.cwd(),
      env: { ...process.env, ...(opts?.env ?? {}) },
      shell: true,
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const to = setTimeout(() => {
      timedOut = true;
      try {
        proc.kill("SIGKILL");
      } catch (e) {
        /* ignore */
      }
    }, timeoutMs);

    proc.stdout?.on("data", (d) => {
      stdout += d.toString();
    });
    proc.stderr?.on("data", (d) => {
      stderr += d.toString();
    });
    proc.on("close", (code) => {
      clearTimeout(to);
      resolve({
        ok: !timedOut && code === 0,
        stdout,
        stderr,
        code,
      });
    });
    proc.on("error", (err) => {
      clearTimeout(to);
      resolve({ ok: false, stdout, stderr: err.message, code: null });
    });
  });
}

async function fileExists(p: string) {
  try {
    await access(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function parseEnvFiles(): Promise<Record<string, string>> {
  const candidates = [".env.local", ".env", ".env.example"];
  const out: Record<string, string> = {};
  for (const c of candidates) {
    const p = path.resolve(process.cwd(), c);
    if (!(await fileExists(p))) continue;
    try {
      const content = await readFile(p, "utf-8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const idx = trimmed.indexOf("=");
        if (idx === -1) continue;
        const k = trimmed.slice(0, idx).trim();
        let v = trimmed.slice(idx + 1).trim();
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
        out[k] = v;
      }
    } catch {
      // ignore
    }
  }
  return out;
}

async function httpFetch(url: string, timeoutMs = 10_000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const text = await res.text();
    clearTimeout(t);
    return { ok: res.ok, status: res.status, text, headers: res.headers };
  } catch (err: any) {
    clearTimeout(t);
    return { ok: false, status: null, text: "", error: err?.message ?? String(err) };
  }
}

/** Very small HTML helpers (regex-based on purpose) */
function extractTag(html: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = html.match(re);
  return m ? m[1].trim() : null;
}
function extractMeta(html: string, name: string): string | null {
  const re = new RegExp(`<meta[^>]*(?:name|property)=(?:'|"|)${escapeReg(name)}(?:'|"|)[^>]*content=(?:'|")([^'"]+)(?:'|")[^>]*>`, "i");
  const m = html.match(re);
  if (m) return m[1].trim();
  // try property=og:...
  const re2 = new RegExp(`<meta[^>]*property=(?:'|")${escapeReg(name)}(?:'|")[^>]*content=(?:'|")([^'"]+)(?:'|")[^>]*>`, "i");
  const m2 = html.match(re2);
  return m2 ? m2[1].trim() : null;
}
function extractLinkRel(html: string, rel: string): string | null {
  const re = new RegExp(`<link[^>]*rel=(?:'|")${escapeReg(rel)}(?:'|")[^>]*href=(?:'|")([^'"]+)(?:'|")[^>]*>`, "i");
  const m = html.match(re);
  return m ? m[1].trim() : null;
}
function findContact(html: string): boolean {
  // Look for mailto:, contact, /contact, phone numbers, contact form
  const mail = /mailto:[\w.+-]+@[\w-]+\.[\w.-]+/i.test(html);
  const contactPath = /href=(?:'|")(\/contact|\/contact-us|\/contactme|\/get-in-touch)(?:'|")/i.test(html) || /contact(?: us)?/i.test(html);
  const form = /<form[^>]*action=[^>]*>/i.test(html);
  return mail || contactPath || form;
}
function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Basic link extraction and shallow checking */
function extractAnchors(html: string): string[] {
  const anchors: string[] = [];
  const re = /<a[^>]*href=(?:'|")([^'"]+)(?:'|")[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const href = (m[1] || "").trim();
      if (href) anchors.push(href);
    } catch {}
  }
  return anchors;
}

async function shallowCheckLinks(base: string, html: string, maxChecks = 30) {
  const anchors = extractAnchors(html)
    .filter(Boolean)
    .map((a) => a.split("#")[0])
    .filter(Boolean);
  const unique = Array.from(new Set(anchors)).slice(0, maxChecks);
  const results: Array<{ url: string; status?: number | string }> = [];
  for (const href of unique) {
    try {
      let url = href;
      if (href.startsWith("/")) {
        url = new URL(href, base).toString();
      } else if (!/^https?:\/\//i.test(href)) {
        // skip other schemes like tel:, mailto:, javascript:
        results.push({ url: href, status: "skip-scheme" });
        continue;
      }
      const r = await httpFetch(url, 8_000);
      results.push({ url, status: r.status ?? "error" });
    } catch (e: any) {
      results.push({ url: href, status: (e && e.message) || "error" });
    }
  }
  return results;
}

/** DATABASE helpers using pg */
async function runDatabaseChecks(connString: string | undefined): Promise<AuditReport["checks"]["database"]> {
  if (!connString) {
    return {
      connected: false,
      notes: ["No database connection string found in env variables."],
    };
  }

  const client = new Client({ connectionString: connString });
  try {
    await client.connect();
  } catch (e: any) {
    return {
      connected: false,
      notes: [`Failed to connect: ${e?.message ?? String(e)}`],
    };
  }

  const out: AuditReport["checks"]["database"] = {
    connected: true,
    tables: [],
    unindexed_foreign_keys: [],
    notes: [],
  };

  try {
    // List user tables
    const tablesRes = await client.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_type='BASE TABLE'
        AND table_schema NOT IN ('pg_catalog','information_schema')
      ORDER BY table_schema, table_name
      LIMIT 200;
    `);

    for (const row of tablesRes.rows) {
      const schema = row.table_schema;
      const name = row.table_name;
      // row estimate using pg_class
      const estRes = await client.query(
        `SELECT reltuples::bigint AS estimate FROM pg_class WHERE oid = $1::regclass`,
        [`${schema}.${name}`]
      );
      const rowEstimate = estRes.rows[0] ? Number(estRes.rows[0].estimate) : undefined;

      // Primary key existence
      const pkRes = await client.query(
        `
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = $1 AND tc.table_name = $2 AND tc.constraint_type = 'PRIMARY KEY';
      `,
        [schema, name]
      );
      const hasPrimaryKey = pkRes.rowCount > 0;

      // columns
      const colRes = await client.query(
        `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position;
      `,
        [schema, name]
      );

      const columns: any[] = [];
      for (const c of colRes.rows) {
        columns.push({ name: c.column_name, data_type: c.data_type, sample_values: [] });
      }

      const suspicious: string[] = [];
      // sample a few rows for suspicious columns (password, secret, token, email)
      const interestingCols = columns
        .map((c) => c.name)
        .filter((n) => /password|pass|secret|token|key|ssn/i.test(n))
        .slice(0, 4);

      if (interestingCols.length > 0) {
        // fetch up to 10 rows selecting those columns
        try {
          const sampleRes = await client.query(
            `SELECT ${interestingCols.map((c, i) => `"${c}"`).join(", ")} FROM "${schema}"."${name}" LIMIT 10;`
          );
          for (let i = 0; i < interestingCols.length; i++) {
            const colName = interestingCols[i];
            const samples = sampleRes.rows.map((r: any) => r[colName]).filter((v: any) => v !== null && v !== undefined);
            const col = columns.find((c) => c.name === colName);
            if (col) col.sample_values = samples;
            // heuristic: if we see low-entropy-looking short strings on password-like columns, flag
            const maybePlain = samples.some((s: any) => {
              if (typeof s !== "string") return false;
              const trimmed = s.trim();
              // If it looks like a bcrypt salt ($2a$...) consider hashed
              if (/^\$2[aby]\$/.test(trimmed)) return false;
              if (trimmed.length < 30) return true;
              return false;
            });
            if (maybePlain) suspicious.push(`Possible plaintext or short password-like values in column "${colName}"`);
          }
        } catch {
          // skip sample on error (permissions)
        }
      }

      // detect large text columns
      for (const c of columns) {
        if (/text|character varying|varchar|json|jsonb/i.test(c.data_type)) {
          // check approximate max length by sampling one row
          try {
            const sres = await client.query(`SELECT "${c.name}" FROM "${schema}"."${name}" WHERE "${c.name}" IS NOT NULL LIMIT 5;`);
            const lengths = sres.rows.map((r: any) => (r[c.name] ? String(r[c.name]).length : 0));
            const max = Math.max(0, ...lengths);
            if (max > 2000) {
              suspicious.push(`Column ${c.name} has large text (sample max length ${max})`);
            }
            c.sample_values = sres.rows.map((r: any) => r[c.name]).slice(0, 3);
          } catch {
            // ignore
          }
        }
      }

      out.tables!.push({
        schema,
        name,
        rowEstimate,
        hasPrimaryKey,
        columns,
        suspicious,
      });
    }

    // find unindexed foreign keys heuristics: columns ending with _id without index
    const fkColsRes = await client.query(
      `
      SELECT ns.nspname AS schema, t.relname AS table, a.attname AS column
      FROM pg_attribute a
      JOIN pg_class t ON a.attrelid = t.oid
      JOIN pg_namespace ns ON t.relnamespace = ns.oid
      WHERE a.attnum > 0
        AND NOT a.attisdropped
        AND a.attname ~ '_id$'
        AND ns.nspname NOT IN ('pg_catalog','information_schema')
      LIMIT 500;
    `
    );

    for (const r of fkColsRes.rows) {
      const tbl = `${r.schema}.${r.table}`;
      // check if there is an index on that column
      const idxRes = await client.query(
        `
        SELECT indexrelid::regclass::text AS index_name
        FROM pg_index
        JOIN pg_class ON pg_class.oid = pg_index.indrelid
        WHERE indrelid = $1::regclass
          AND (pg_get_indexdef(indexrelid) ILIKE '%' || $2 || '%');
      `,
        [tbl, r.column]
      );
      if (idxRes.rowCount === 0) {
        out.unindexed_foreign_keys!.push({ table: tbl, column: r.column });
      }
    }
  } catch (e: any) {
    out.notes!.push(`Error while running DB checks: ${e?.message ?? String(e)}`);
  } finally {
    try {
      await client.end();
    } catch {}
  }

  return out;
}

/** Compose summary from findings */
function summarize(report: AuditReport) {
  const issues: string[] = [];
  const p = report.checks.project;
  if (p.lint && !p.lint.ok) issues.push("Lint failed or produced warnings (see report).");
  if (p.test && !p.test.ok) issues.push("Tests failing.");
  if (p.typecheck && !p.typecheck.ok) issues.push("Typecheck (tsc) failed.");
  if (p.build && !p.build.ok) issues.push("Build failed.");
  if (p.audit && p.audit.summary && Array.isArray(p.audit.summary.advisories) && p.audit.summary.advisories.length > 0) {
    issues.push("Security advisories found in npm audit.");
  }
  if (!report.checks.http.reachable) issues.push("Site not reachable at provided host.");
  if (!report.checks.http.metaDescription) issues.push("Missing meta description.");
  if (!report.checks.http.title && report.checks.http.reachable) issues.push("Missing <title> on homepage.");
  if (!report.checks.http.contactFound) issues.push("No contact CTA or mailto link detected on homepage.");
  if (report.checks.database && report.checks.database.connected) {
    const db = report.checks.database;
    const tablesWithNoPK = (db.tables || []).filter((t) => !t.hasPrimaryKey);
    if (tablesWithNoPK.length) issues.push(`Found ${tablesWithNoPK.length} table(s) without primary keys.`);
    if ((db.unindexed_foreign_keys || []).length) issues.push(`${db.unindexed_foreign_keys.length} probable unindexed foreign key columns.`);
    const plaintextFindings = (db.tables || []).flatMap((t) => t.suspicious || []).filter((s) => /plaintext|password|short password/i.test(s));
    if (plaintextFindings.length) issues.push(`Possible plaintext credentials found in DB samples (${plaintextFindings.length}).`);
  }
  return { issues, score: null };
}

async function runProjectChecks(cwd: string) {
  const project: AuditReport["checks"]["project"] = {
    lint: undefined,
    test: undefined,
    typecheck: undefined,
    build: undefined,
    audit: null,
    outdated: null,
  };

  // prefer bun commands if bun is present in PATH
  const useBun = await (async () => {
    try {
      const r = await runCommand("bun --version", [], { timeoutMs: 3000 });
      return r.ok;
    } catch {
      return false;
    }
  })();

  const run = (cmdLine: string, timeoutMs = 30_000) => {
    // split into shell to allow complex npm scripts
    return runCommand(cmdLine, [], { timeoutMs, cwd });
  };

  // lint
  const lintCmd = useBun ? "bun run lint" : "npm run lint";
  project.lint = { cmd: lintCmd, ...(await run(lintCmd, 20_000)) };

  // test
  const testCmd = useBun ? "bun test" : "npm test";
  project.test = { cmd: testCmd, ...(await run(testCmd, 20_000)) };

  // tsc
  const tscCmd = "npx tsc --noEmit";
  project.typecheck = { cmd: tscCmd, ...(await run(tscCmd, 30_000)) };

  // build
  const buildCmd = useBun ? "bun run build" : "npm run build";
  project.build = { cmd: buildCmd, ...(await run(buildCmd, 60_000)) };

  // npm audit (best-effort) - may not be available with bun
  try {
    const auditCmd = "npm audit --json";
    const auditRes = await run(auditCmd, 30_000);
    project.audit = { cmd: auditCmd, ok: auditRes.ok, summary: (() => {
      try { return JSON.parse(auditRes.stdout || "{}"); } catch { return auditRes.stdout; }
    })() };
  } catch {
    project.audit = null;
  }

  // outdated
  try {
    const outCmd = "npm outdated --json";
    const outRes = await run(outCmd, 15_000);
    project.outdated = { cmd: outCmd, ok: outRes.ok, stdout: outRes.stdout };
  } catch {
    project.outdated = null;
  }

  return project;
}

async function tryDevRun(timeoutMs = 20_000) {
  // Attempt to run `bun run dev` or `npm run dev` briefly to capture startup errors, then kill.
  const tryUseBun = await (async () => {
    try {
      const r = await runCommand("bun --version", [], { timeoutMs: 2000 });
      return r.ok;
    } catch {
      return false;
    }
  })();

  const cmd = tryUseBun ? "bun run dev" : "npm run dev";
  // spawn directly to stream output and kill after timeout
  return new Promise<{ ok: boolean; stdout: string; stderr: string; cmd: string }>((resolve) => {
    const proc = spawn(cmd, [], { shell: true, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const start = Date.now();
    const t = setTimeout(() => {
      try {
        proc.kill("SIGKILL");
      } catch {}
    }, timeoutMs);

    proc.stdout?.on("data", (d) => {
      const s = d.toString();
      stdout += s;
    });
    proc.stderr?.on("data", (d) => {
      stderr += d.toString();
    });
    proc.on("close", (code) => {
      clearTimeout(t);
      const ok = code === 0 || (Date.now() - start) < timeoutMs; // if it was killed due to timeout we still capture errors
      resolve({ ok, stdout, stderr, cmd });
    });
    proc.on("error", (err) => {
      clearTimeout(t);
      resolve({ ok: false, stdout, stderr: err.message, cmd });
    });
  });
}

async function main() {
  const args = parseArgs();
  const cwd = process.cwd();
  const env = await parseEnvFiles();
  const report: AuditReport = {
    meta: {
      generatedAt: new Date().toISOString(),
      host: args.host,
      cwd,
      tryDev: args.tryDev,
      dbConnected: false,
    },
    checks: {
      project: {
        lint: undefined,
        test: undefined,
        typecheck: undefined,
        build: undefined,
        audit: null,
        outdated: null,
      },
      http: {
        reachable: false,
        brokenLinks: [],
        rawHtml: "",
      },
      devRun: null,
      database: null,
      raw: {},
    },
    summary: { issues: [], score: null },
  };

  console.log(`\n[site-audit] Starting audit for host: ${args.host}`);
  console.log(`[site-audit] Working directory: ${cwd}`);
  console.log(`[site-audit] Checking project (lint/test/typecheck/build)...`);

  try {
    report.checks.project = await runProjectChecks(cwd);
  } catch (e: any) {
    report.checks.project = report.checks.project || ({} as any);
    report.checks.project.lint = { ok: false, stdout: "", stderr: `Project checks failed: ${e?.message ?? String(e)}`, cmd: "internal" };
  }

  // HTTP checks
  console.log(`[site-audit] Fetching ${args.host} ...`);
  try {
    const h = await httpFetch(args.host, 10_000);
    if (!h.ok) {
      report.checks.http.reachable = false;
      report.checks.http.status = h.status ?? undefined;
      report.checks.http.rawHtml = h.text || "";
      if (h.error) report.checks.http.rawHtml += `\n<!-- fetch error: ${h.error} -->`;
    } else {
      report.checks.http.reachable = true;
      report.checks.http.status = h.status;
      report.checks.http.rawHtml = h.text;
      report.checks.http.title = extractTag(h.text, "title");
      report.checks.http.metaDescription = extractMeta(h.text, "description") || extractMeta(h.text, "og:description");
      report.checks.http.ogTitle = extractMeta(h.text, "og:title") || undefined;
      report.checks.http.canonical = extractLinkRel(h.text, "canonical") || undefined;
      report.checks.http.contactFound = findContact(h.text);
      report.checks.http.robots = false;
      report.checks.http.sitemap = false;

      // robots.txt
      try {
        const robots = await httpFetch(new URL("/robots.txt", args.host).toString(), 6_000);
        report.checks.http.robots = robots.ok;
      } catch {}
      // sitemap.xml
      try {
        const sm = await httpFetch(new URL("/sitemap.xml", args.host).toString(), 6_000);
        report.checks.http.sitemap = sm.ok;
      } catch {}

      // shallow link checks
      const broken = await shallowCheckLinks(args.host, h.text, args.maxLinkChecks);
      report.checks.http.brokenLinks = broken.filter((r) => {
        return !(typeof r.status === "number" && r.status >= 200 && r.status < 400);
      });
    }
  } catch (e: any) {
    report.checks.http.reachable = false;
    report.checks.http.rawHtml = `<!-- fetch failed: ${e?.message ?? String(e)} -->`;
  }

  // Try dev run if requested
  if (args.tryDev) {
    console.log("[site-audit] Attempting to start dev server briefly to capture startup output...");
    try {
      const devRes = await tryDevRun(18_000);
      report.checks.devRun = devRes;
      if (devRes.stderr && devRes.stderr.length > 0) {
        console.log("[site-audit] Dev run stderr snapshot:");
        const lines = devRes.stderr.split(/\r?\n/).slice(0, 20).join("\n");
        console.log(lines);
      }
    } catch (e: any) {
      report.checks.devRun = { ok: false, stdout: "", stderr: String(e?.message ?? e), cmd: "dev-check" };
    }
  }

  // Database checks
  if (args.doDb) {
    const connString = process.env.DATABASE_URL || env["DATABASE_URL"] || env["PG_CONNECTION_STRING"] || env["DATABASE_URL_LOCAL"] || env["DATABASE_URL_LOCALHOST"];
    if (!connString) {
      console.log("[site-audit] No DATABASE_URL found in env files. Skipping DB checks.");
      report.checks.database = { connected: false, notes: ["No DATABASE_URL found in environment or .env files."] };
    } else {
      console.log("[site-audit] Running database checks (this requires the DB to be reachable).");
      try {
        report.checks.database = await runDatabaseChecks(connString);
        report.meta.dbConnected = !!report.checks.database.connected;
      } catch (e: any) {
        report.checks.database = { connected: false, notes: [`DB check error: ${e?.message ?? String(e)}`] };
      }
    }
  } else {
    report.checks.database = null;
  }

  // Summarize
  report.summary = summarize(report);
  report.checks.raw = { env };

  // Save report
  const outPath = path.resolve(process.cwd(), parseArgs().out);
  try {
    await writeFile(outPath, JSON.stringify(report, null, 2), "utf-8");
    console.log(`\n[site-audit] Report written to ${outPath}`);
  } catch (e: any) {
    console.error(`[site-audit] Failed to write report: ${e?.message ?? String(e)}`);
  }

  // Human readable summary
  console.log("\n=== AUDIT SUMMARY ===");
  console.log(`Host reachable: ${report.checks.http.reachable ? "yes" : "no"} (${report.checks.http.status ?? "N/A"})`);
  if (report.checks.project.lint) console.log(`Lint: ${report.checks.project.lint.ok ? "ok" : "issues (see report)"}`);
  if (report.checks.project.test) console.log(`Tests: ${report.checks.project.test.ok ? "ok" : "failing (see report)"}`);
  if (report.checks.project.typecheck) console.log(`Typecheck: ${report.checks.project.typecheck.ok ? "ok" : "errors (see report)"}`);
  if (report.checks.project.build) console.log(`Build: ${report.checks.project.build.ok ? "ok" : "failed (see report)"}`);
  if (report.checks.http.title) console.log(`Title: ${report.checks.http.title}`);
  if (report.checks.http.metaDescription) console.log(`Meta description: ${report.checks.http.metaDescription}`);
  console.log(`Contact CTA found: ${report.checks.http.contactFound ? "yes" : "no"}`);
  if (report.checks.http.brokenLinks && report.checks.http.brokenLinks.length) {
    console.log(`Broken or non-2xx links sampled: ${report.checks.http.brokenLinks.length} (see report)`);
  }
  if (report.checks.database && report.checks.database.connected) {
    const nd = report.checks.database;
    console.log(`DB connected: yes. Tables scanned: ${nd.tables?.length ?? 0}`);
    if (nd.unindexed_foreign_keys && nd.unindexed_foreign_keys.length) {
      console.log(`Probable unindexed foreign keys: ${nd.unindexed_foreign_keys.length}`);
    }
    const tablesNoPk = (nd.tables || []).filter((t) => !t.hasPrimaryKey).length;
    if (tablesNoPk) console.log(`Tables without primary key: ${tablesNoPk}`);
  } else {
    console.log("DB connected: no (skipped or failed)");
  }

  // Print issues
  if (report.summary.issues.length) {
    console.log("\nPRIORITIZED ACTIONS:");
    report.summary.issues.forEach((i, idx) => {
      console.log(`${idx + 1}. ${i}`);
    });
  } else {
    console.log("\nNo immediate high-level issues detected by heuristics. See full report for details.");
  }

  console.log("\n[site-audit] Done.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("[site-audit] Unexpected error:", err);
  process.exit(2);
});
