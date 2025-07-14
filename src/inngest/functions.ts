import * as ChromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import config from '../config/config.js';
import { auditSuggestionPrompt } from '../utils/prompts.js';
import { auditSuggestionAgent } from './agents/suggestion-agent.js';
import { inngest } from './client.js';

export const auditSummary = inngest.createFunction(
  { id: 'perform-audit' },
  { event: 'audit/audit.summary' },
  async ({ event, step }) => {
    const result = await step.run('run lighthouse', async () => {
      const chrome = await ChromeLauncher.launch({
        chromeFlags: [
          '--headless=new',
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--disable-accelerated-2d-canvas',
          '--no-zygote',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-features=Translate,OptimizationHints,MediaRouter,DialMediaRouteProvider,CalculateNativeWinOcclusion,InterestFeedContentSuggestions,CertificateTransparencyComponentUpdater,AutofillServerCommunication,PrivacySandboxSettings4,site-per-process',
        ],
        chromePath: config.chromePath,
      });

      const result = await lighthouse(event.data.url, {
        port: chrome.port,
        output: 'html',
        throttlingMethod: 'provided',
      });

      const unusedJsAudit = result?.lhr.audits['unused-javascript'];
      const unusedJsSavings =
        unusedJsAudit?.details && 'overallSavingsBytes' in unusedJsAudit.details
          ? (unusedJsAudit.details as any).overallSavingsBytes
          : null;

      const renderBlockingAudit = result?.lhr.audits['render-blocking-resources'];
      const renderBlockingItems =
        renderBlockingAudit?.details && 'items' in renderBlockingAudit.details
          ? (renderBlockingAudit.details as any).items
          : [];

      const response = {
        url: event.data.url as string,
        scores: {
          performance: result?.lhr.categories.performance.score ?? 0,
          accessibility: result?.lhr.categories.accessibility.score ?? 0,
          bestPractices: result?.lhr.categories['best-practices'].score ?? 0,
          seo: result?.lhr.categories.seo.score ?? 0,
          pwa: result?.lhr.categories.pwa?.score ?? null,
        },
        audits: {
          firstContentfulPaint: result?.lhr.audits['first-contentful-paint'].displayValue,
          largestContentfulPaint: result?.lhr.audits['largest-contentful-paint'].displayValue,
          cumulativeLayoutShift: result?.lhr.audits['cumulative-layout-shift'].displayValue,
          unusedJavascript: unusedJsSavings,
          renderBlockingResources: renderBlockingItems,
          interactive: result?.lhr.audits.interactive.displayValue,
          speedIndex: result?.lhr.audits['speed-index'].displayValue,
        },
      };

      chrome.kill();
      return response;
    });

    const { output } = await auditSuggestionAgent.run(auditSuggestionPrompt(result));

    const enrichedOutput = output.map((message, index) =>
      index === 0 ? { ...message, score: result.scores } : message,
    );

    return enrichedOutput;
  },
);

export const functions = [auditSummary];
