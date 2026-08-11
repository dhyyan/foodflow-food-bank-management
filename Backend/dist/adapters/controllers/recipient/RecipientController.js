"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipientController = void 0;
class RecipientController {
    createRecipientUseCase;
    getRecipientsUseCase;
    constructor(createRecipientUseCase, getRecipientsUseCase) {
        this.createRecipientUseCase = createRecipientUseCase;
        this.getRecipientsUseCase = getRecipientsUseCase;
    }
    create = async (req, res, next) => {
        try {
            const dto = {
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
        }
        catch (error) {
            next(error);
        }
    };
    getAll = async (req, res, next) => {
        try {
            const type = req.query.type;
            const search = req.query.search;
            const recipients = await this.getRecipientsUseCase.execute({ type, search });
            res.status(200).json({
                success: true,
                message: 'Recipients retrieved successfully',
                data: recipients
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.RecipientController = RecipientController;
