import { Request, Response, NextFunction } from 'express';
import { FieldAuditLogModel } from '../../../frameWork/database/models/FieldAuditLogModel';
import { LotEventModel } from '../../../frameWork/database/models/LotEventModel';

export class AuditController {
  getFieldHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { lotId } = req.params;
      
      const fieldLogs = await FieldAuditLogModel.find({ entityId: lotId }).sort({ timestamp: -1 });
      const statusLogs = await LotEventModel.find({ lotId }).sort({ timestamp: -1 });

      res.status(200).json({
        success: true,
        data: {
          fieldDiffs: fieldLogs,
          statusEvents: statusLogs
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
