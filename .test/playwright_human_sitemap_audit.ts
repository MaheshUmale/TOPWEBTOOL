/**
 * Complete, Runnable Playwright + Ghost-Cursor QA Automation Framework
 *
 * Requirements:
 * npm install playwright ghost-cursor fast-xml-parser
 * npx playwright install chromium
 */

import { chromium, BrowserContext, Page } from 'playwright';
import { createCursor, GhostCursor } from 'ghost-cursor';
import { XMLParser } from 'fast-xml-parser';
import * as fs from 'fs';
import * as path from 'path';

// --- CONFIGURATION ---
const SITEMAP_URL = 'https://topwebtool.com/sitemap.xml';
const DEFAULT_MAX_PAGES = 10;
const OUTPUT_REPORT_PATH = './human_sitemap_audit_report.json';
const OUTPUT_MARKDOWN_PATH = './human_sitemap_audit_report.md';

const VIEWPORTS = [
  { width: 1920, height: 1080 },
  { width: 1536, height: 864 },
  { width: 1440, height: 900 },
  { width: 1366, height: 768 }
];

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
];

interface AuditResult {
  url: string;
  status: 'PASSED' | 'FAILED';
  loadTimeMs: number;
  consoleErrors: string[];
  networkErrors: string[];
  elementsTested: number;
  interactionsLog: string[];
}

// Helper for randomized delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Fetch and Parse Sitemap XML
async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
  console.log(`[Sitemap] Fetching ${sitemapUrl}...`);
  const response = await fetch(sitemapUrl, {
    headers: { 'User-Agent': USER_AGENTS[0] }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.status} ${response.statusText}`);
  }
  const xmlText = await response.text();
  const parser = new XMLParser();
  const parsed = parser.parse(xmlText);

  const urls: string[] = [];

  if (parsed.urlset && parsed.urlset.url) {
    const list = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];
    list.forEach((item: any) => {
      if (item.loc) urls.push(typeof item.loc === 'string' ? item.loc.trim() : item.loc['#text']);
    });
  } else if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
    const list = Array.isArray(parsed.sitemapindex.sitemap) ? parsed.sitemapindex.sitemap : [parsed.sitemapindex.sitemap];
    for (const sm of list.slice(0, 3)) {
      const subLoc = typeof sm.loc === 'string' ? sm.loc.trim() : sm.loc['#text'];
      if (subLoc) {
        const subUrls = await fetchSitemapUrls(subLoc);
        urls.push(...subUrls);
      }
    }
  }

  return Array.from(new Set(urls));
}

// Human-like Typing Emulation
async function humanType(page: Page, cursor: GhostCursor, selector: string, text: string) {
  const element = page.locator(selector).first();
  if (!(await element.isVisible())) return;

  const box = await element.boundingBox();
  if (!box) return;

  // Move Bezier curve to element center
  const targetX = box.x + box.width / 2;
  const targetY = box.y + box.height / 2;
  await cursor.moveTo({ x: targetX, y: targetY });

  // Physical mouse down and up to focus
  await page.mouse.down();
  await sleep(randomBetween(40, 90));
  await page.mouse.up();

  // Type characters with human jitter
  for (const char of text) {
    await page.keyboard.type(char);
    await sleep(randomBetween(50, 150));
  }
}

// Human-like Smooth Page Scroll
async function humanScroll(page: Page, cursor: GhostCursor) {
  const scrollDistance = randomBetween(300, 600);
  const steps = 10;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((amount) => window.scrollBy(0, amount), scrollDistance / steps);
    await sleep(randomBetween(20, 50));
  }
  // Random mouse wiggle during scroll
  const currentPos = cursor.getLocation();
  await cursor.moveTo({
    x: currentPos.x + randomBetween(-30, 30),
    y: currentPos.y + randomBetween(-20, 20)
  });
}

// Main Automation Runner
async function runHumanSitemapAudit() {
  const targetUrls = await fetchSitemapUrls(SITEMAP_URL);
  console.log(`[Sitemap] Found ${targetUrls.length} URLs. Auditing top ${DEFAULT_MAX_PAGES}...`);

  const selectedViewport = VIEWPORTS[Math.floor(Math.random() * VIEWPORTS.length)];
  const selectedUserAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

  // Launch non-headless browser instance with stealth parameters
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      `--window-size=${selectedViewport.width},${selectedViewport.height}`
    ]
  });

  const context: BrowserContext = await browser.newContext({
    viewport: selectedViewport,
    userAgent: selectedUserAgent
  });

  const page = await context.newPage();
  const cursor = createCursor(page);

  const results: AuditResult[] = [];

  for (const url of targetUrls.slice(0, DEFAULT_MAX_PAGES)) {
    console.log(`\n[Audit] Navigating to: ${url}`);
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];
    const interactionsLog: string[] = [];

    // Attach Log Listeners
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('response', response => {
      if (response.status() >= 400) {
        networkErrors.push(`[${response.status()}] ${response.url()}`);
      }
    });

    const startTime = Date.now();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const loadTimeMs = Date.now() - startTime;

      // Initial thinking pause (1-3 seconds)
      const pause = randomBetween(1000, 3000);
      interactionsLog.push(`Page loaded in ${loadTimeMs}ms. Thinking pause: ${pause}ms`);
      await sleep(pause);

      // Random mouse entry move
      await cursor.moveTo({
        x: randomBetween(100, selectedViewport.width - 100),
        y: randomBetween(100, selectedViewport.height - 100)
      });

      // Human-like lazy-load scroll
      interactionsLog.push('Performing kinetic smooth scrolling...');
      await humanScroll(page, cursor);

      // Locate interactive controls
      const buttons = await page.locator('button, a[href], input[type="submit"]').all();
      let elementsTested = 0;

      for (const btn of buttons.slice(0, 5)) { // interact with up to 5 elements per page
        if (await btn.isVisible()) {
          const box = await btn.boundingBox();
          if (box && box.width > 0 && box.height > 0) {
            const targetX = box.x + box.width / 2;
            const targetY = box.y + box.height / 2;

            interactionsLog.push(`Ghost-cursor Bezier move to (${Math.round(targetX)}, ${Math.round(targetY)})`);
            await cursor.moveTo({ x: targetX, y: targetY });

            // Physical click
            await page.mouse.down();
            await sleep(randomBetween(50, 100));
            await page.mouse.up();

            elementsTested++;
            await sleep(randomBetween(300, 700));
          }
        }
      }

      // Check form inputs
      const inputs = await page.locator('input[type="text"], input[type="search"]').all();
      if (inputs.length > 0) {
        interactionsLog.push('Emulating human keystrokes in search/input field...');
        await humanType(page, cursor, 'input[type="text"], input[type="search"]', 'human test audit');
      }

      results.push({
        url,
        status: (consoleErrors.length === 0 && networkErrors.length === 0) ? 'PASSED' : 'FAILED',
        loadTimeMs,
        consoleErrors,
        networkErrors,
        elementsTested,
        interactionsLog
      });

    } catch (err: any) {
      results.push({
        url,
        status: 'FAILED',
        loadTimeMs: Date.now() - startTime,
        consoleErrors,
        networkErrors: [`Navigation error: ${err.message}`],
        elementsTested: 0,
        interactionsLog: ['Page load failed or timed out']
      });
    }
  }

  await browser.close();

  // Export JSON Report
  fs.writeFileSync(OUTPUT_REPORT_PATH, JSON.stringify(results, null, 2));

  // Export Markdown Report
  let md = `# Sitemap Human Automation QA Audit Report\n\n`;
  md += `**Timestamp:** ${new Date().toISOString()}\n`;
  md += `**Target Sitemap:** ${SITEMAP_URL}\n\n`;
  md += `| URL | Status | Load Time | Console Errors | Network Failures | Tested Elements |\n`;
  md += `| --- | --- | --- | --- | --- | --- |\n`;

  results.forEach(r => {
    md += `| ${r.url} | ${r.status === 'PASSED' ? '✅ PASSED' : '❌ FAILED'} | ${r.loadTimeMs}ms | ${r.consoleErrors.length} | ${r.networkErrors.length} | ${r.elementsTested} |\n`;
  });

  fs.writeFileSync(OUTPUT_MARKDOWN_PATH, md);
  console.log(`\n[Audit Complete] Saved reports to ${OUTPUT_REPORT_PATH} and ${OUTPUT_MARKDOWN_PATH}`);
}

runHumanSitemapAudit().catch(console.error);
