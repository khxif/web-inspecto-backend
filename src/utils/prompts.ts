export interface AuditSuggestionPromptProps {
  url: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    pwa: number | null;
  };
  audits: {
    firstContentfulPaint?: string;
    largestContentfulPaint?: string;
    cumulativeLayoutShift?: string;
    unusedJavascript: number | null;
    renderBlockingResources: {
      url: string;
      transferSize?: number;
      startTime?: number;
      endTime?: number;
    }[];
    interactive?: string;
    speedIndex?: string;
  };
}

export const auditSuggestionPrompt = ({
  url,
  scores: { performance, accessibility, bestPractices, seo, pwa },
  audits: {
    firstContentfulPaint,
    largestContentfulPaint,
    cumulativeLayoutShift,
    unusedJavascript,
    renderBlockingResources,
    interactive,
    speedIndex,
  },
}: AuditSuggestionPromptProps) => {
  return `You are a professional frontend performance analyst evaluating a Lighthouse audit report.

The audit results for the website are as follows:

- 🌐 **URL**: ${url}
- ⚡ **Performance**: ${performance * 100}
- ♿ **Accessibility**: ${accessibility * 100}
- 🛡 **Best Practices**: ${bestPractices * 100}
- 🔍 **SEO**: ${seo * 100}
- 📲 **PWA**: ${pwa ? pwa * 100 : 'Not Applicable'}

The audit also includes the following metrics:
- ⏱ **First Contentful Paint**: ${firstContentfulPaint ?? 'N/A'}
- 🖼 **Largest Contentful Paint**: ${largestContentfulPaint ?? 'N/A'}
- 🎯 **Cumulative Layout Shift**: ${cumulativeLayoutShift ?? 'N/A'}
- 🐢 **Speed Index**: ${speedIndex ?? 'N/A'}
- 🕹 **Time to Interactive**: ${interactive ?? 'N/A'}
- 🧹 **Unused JavaScript**: ${unusedJavascript ? `${unusedJavascript} bytes` : 'N/A'}
- ⛔ **Render-Blocking Resources**: ${
    renderBlockingResources?.length > 0
      ? renderBlockingResources
          .map(r => r.url)
          .slice(0, 3)
          .join(', ') + '...'
      : 'None'
  }

---

Please analyze the report and provide:

1. A concise summary that highlights the overall audit, including praise for perfect scores (score = 1).
2. Key issues or red flags based on **scores** and **audit metrics**.
3. Clear, actionable recommendations with context and examples.
4. Code snippets or UI optimization examples where applicable.

Respond in **Markdown** format using the following sections. Use **emojis** for visual clarity:

## 📝 Summary

## ⚠️ Issues

## ✅ Recommendations

## 🛠 Suggested Fixes
`;
};
