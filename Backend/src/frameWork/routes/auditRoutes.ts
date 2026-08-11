import { Router } from 'express';
import { AuditController } from '../../adapters/controllers/audit/AuditController';
import { jwtMiddleware } from '../DI/authInject';

const router = Router();
const auditController = new AuditController();

router.get('/field-history/:lotId', jwtMiddleware, auditController.getFieldHistory);

export default router;
