import { Inngest } from 'inngest';
import config from '../config/config.js';

export const inngest = new Inngest({
  id: 'web-inspecto',
  ...(config.nodeEnv !== 'production'
    ? { baseUrl: config.inngestBaseUrl }
    : { eventKey: config.inngestEventKey }),
});
