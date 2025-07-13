import { Inngest } from 'inngest';
import config from '../config/config.js';

export const inngest = new Inngest({
  id: 'web-inspecto',
  eventKey: config.inngestEventKey,
  baseUrl: 'http://host.docker.internal:8288/v1',
});
