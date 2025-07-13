import { Inngest } from 'inngest';
import config from '../config/config.js';

const isProd = config.nodeEnv === 'production';

export const inngest = new Inngest({
  id: 'web-inspecto',
  ...(isProd
    ? { eventKey: config.inngestEventKey } 
    : { baseUrl: config.inngestApiUrl }),
});
