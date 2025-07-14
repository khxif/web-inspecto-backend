import * as ChromeLauncher from 'chrome-launcher';
import config from '../config/config.js';

export const chrome = await ChromeLauncher.launch({
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
