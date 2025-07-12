import * as ChromeLauncher from 'chrome-launcher';
import { NextFunction, Request, Response } from 'express';
import lighthouse from 'lighthouse';
import { inngest } from '../inngest/client.js';
import { getRunOutput, getRuns } from '../utils/index.js';

export const performAudit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;

    const response = await inngest.send({
      name: 'audit/audit.summary',
      data: { url },
    });

    console.log(response);

    res.status(200).json({ eventId: response.ids[0] });
  } catch (error) {
    next(error);
  }
};

export const getAudit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventId } = req.query;

    const run = await getRunOutput(eventId as string);
    console.log(run.output);

    res.json({ output: run.output, status: run.status });
  } catch (error) {
    next(error);
  }
};
