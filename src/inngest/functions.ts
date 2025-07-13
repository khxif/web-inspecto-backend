import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
import { auditSuggestionPrompt } from '../utils/prompts.js';
import { auditSuggestionAgent } from './agents/suggestion-agent.js';
import { inngest } from './client.js';
import config from '../config/config.js';

export const auditSummary = inngest.createFunction(
  { id: 'perform-audit' },
  { event: 'audit/audit.summary' },
  async ({ event, step }) => {
    const result = await step.run('run lighthouse', async () => {
      const chrome = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: config.chromePath,
      });

      const endpoint = chrome.wsEndpoint();

      const result = await lighthouse(event.data.url, {
        port: Number(new URL(endpoint).port),
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

      console.log(result?.lhr.audits['unused-javascript'].details);

      await chrome.close();
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
