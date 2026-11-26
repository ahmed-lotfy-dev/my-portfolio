#!/usr/bin/env bun
/**
 * IndexNow Ping Script
 * 
 * Submits changed URLs to IndexNow API (https://www.indexnow.org/)
 * Used by Bing, Yandex, Naver, Seznam, and others for instant indexing.
 * 
 * Usage: bun run scripts/indexnow-ping.ts
 * 
 * Requires:
 * - INDEX_NOW_KEY environment variable (or uses the key file at public/3f0a001808a41a791e72eec0ab1dfe42d8bf21497534093cf15c31130d7914c3.txt)
 * - SITEMAP_URL environment variable (defaults to https://alotfy.site/sitemap.xml)
 */

import { readFileSync } from "fs";
import { join } from "path";

const INDEX_NOW_API = "https://api.indexnow.org/indexnow";
const KEY_FILE = join(process.cwd(), "public", "3f0a001808a41a791e72eec0ab1dfe42d8bf21497534093cf15c31130d7914c3.txt");
const SITEMAP_URL = process.env.SITEMAP_URL || "https://alotfy.site/sitemap.xml";

async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
  try {
    const response = await fetch(sitemapUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
    }
    const xml = await response.text();
    
    // Parse XML to extract URLs
    const urlMatches = xml.match(/<loc>(.*?)<\/loc>/g);
    if (!urlMatches) return [];
    
    return urlMatches.map(match => match.replace(/<\/?loc>/g, "").trim());
  } catch (error) {
    console.error("Failed to fetch sitemap:", error);
    return [];
  }
}

async function submitToIndexNow(urls: string[], key: string): Promise<boolean> {
  if (urls.length === 0) {
    console.log("No URLs to submit");
    return false;
  }

  // IndexNow accepts max 10,000 URLs per request
  const chunks = [];
  for (let i = 0; i < urls.length; i += 10000) {
    chunks.push(urls.slice(i, i + 10000));
  }

  let allSuccess = true;
  
  for (const chunk of chunks) {
    const payload = {
      host: "alotfy.site",
      key,
      keyLocation: "https://alotfy.site/3f0a001808a41a791e72eec0ab1dfe42d8bf21497534093cf15c31130d7914c3.txt",
      urlList: chunk,
    };

    try {
      const response = await fetch(INDEX_NOW_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Submitted ${chunk.length} URLs to IndexNow`);
      } else {
        const error = await response.text();
        console.error(`❌ Failed to submit batch: ${response.status} - ${error}`);
        allSuccess = false;
      }
    } catch (error) {
      console.error("❌ Error submitting to IndexNow:", error);
      allSuccess = false;
    }
  }

  return allSuccess;
}

async function main() {
  console.log("🚀 Starting IndexNow submission...");
  
  // Get the key
  let key = process.env.INDEX_NOW_KEY;
  if (!key) {
    try {
      key = readFileSync(KEY_FILE, "utf-8").trim();
      console.log(`🔑 Using key from file: ${KEY_FILE}`);
    } catch {
      console.error("❌ No IndexNow key found. Set INDEX_NOW_KEY env var or create key file at:", KEY_FILE);
      process.exit(1);
    }
  }

  // Fetch URLs from sitemap
  console.log(`📥 Fetching sitemap from ${SITEMAP_URL}...`);
  const urls = await fetchSitemapUrls(SITEMAP_URL);
  
  if (urls.length === 0) {
    console.log("⚠️ No URLs found in sitemap");
    return;
  }

  console.log(`📋 Found ${urls.length} URLs in sitemap`);

  // Submit to IndexNow
  console.log("📤 Submitting to IndexNow...");
  const success = await submitToIndexNow(urls, key);

  if (success) {
    console.log("✅ IndexNow submission completed successfully!");
  } else {
    console.error("❌ Some batches failed");
    process.exit(1);
  }
}

main().catch(console.error);