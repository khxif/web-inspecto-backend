import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  geminiApiKey: string;
  inngestSigningKey: string;
  inngestApiUrl: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 8888,
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  inngestSigningKey: process.env.INNGEST_SIGNING_KEY || '',
  inngestApiUrl: process.env.INNGEST_API_URL || '',
};

export default config;
