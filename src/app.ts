import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { serve } from 'inngest/express';
import { inngest } from './inngest/client.js';
import { errorHandler } from './middlewares/error-handler.js';
import { functions } from './inngest/functions.js';

import auditRoutes from './routes/audit.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/audit', auditRoutes);
app.use('/api/inngest', serve({ client: inngest, functions }));

app.use(errorHandler);

export default app;
