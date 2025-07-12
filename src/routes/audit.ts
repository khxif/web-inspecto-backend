import { Router } from 'express';
import * as AuditControllers from '../controllers/audit.js';

const router = Router();

router.get('/', AuditControllers.getAudit);
router.post('/', AuditControllers.performAudit);

export default router;
