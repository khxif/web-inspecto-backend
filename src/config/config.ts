import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

interface Config {
  port: number;
  geminiApiKey: string;
  inngestSigningKey: string;
  inngestApiUrl: string;
  inngestEventKey: string;
  chromePath: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 8888,
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  inngestSigningKey: process.env.INNGEST_SIGNING_KEY || '',
  inngestApiUrl: process.env.INNGEST_API_URL || '',
  inngestEventKey: process.env.INNGEST_EVENT_KEY || '',
  chromePath: process.env.CHROME_PATH || '',
};

export default config;
