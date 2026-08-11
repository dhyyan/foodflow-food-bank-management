import { Request, Response, NextFunction } from 'express';
import { CreateRecipientUseCase } from '../../../useCase/recipient/CreateRecipientUseCase';
import { GetRecipientsUseCase } from '../../../useCase/recipient/GetRecipientsUseCase';
import { CreateRecipientDTO } from '../../../domain/interface/DTOs/RecipientDTO';
import { RecipientType } from '../../../domain/entities/Recipient';

export class RecipientController {
  constructor(
    private readonly createRecipientUseCase: CreateRecipientUseCase,
    private readonly getRecipientsUseCase: GetRecipientsUseCase
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateRecipientDTO = {
        name: req.body.name,
        type: req.body.type,
        monthlyQuota: req.body.monthlyQuota ? Number(req.body.monthlyQuota) : undefined,
        contactPerson: req.body.contactPerson,
        contactEmail: req.body.contactEmail,
        address: req.body.address
      };

      const recipient = await this.createRecipientUseCase.execute(dto);

      res.status(201).json({
        success: true,
        message: 'Recipient created successfully',
        data: recipient
      });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const type = req.query.type as RecipientType | undefined;
      const search = req.query.search as string | undefined;

      const recipients = await this.getRecipientsUseCase.execute({ type, search });

      res.status(200).json({
        success: true,
        message: 'Recipients retrieved successfully',
        data: recipients
      });
    } catch (error) {
      next(error);
    }
  };
}
