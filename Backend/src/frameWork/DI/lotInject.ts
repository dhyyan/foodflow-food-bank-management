import { lotRepository } from './donationInject';
import { GetLotsUseCase } from '../../useCase/lot/GetLotsUseCase';
import { LotController } from '../../adapters/controllers/lot/LotController';

const getLotsUseCase = new GetLotsUseCase(lotRepository);

export const lotController = new LotController(getLotsUseCase);
