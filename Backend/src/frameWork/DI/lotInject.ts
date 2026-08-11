import { lotRepository, lotEventRepository, donationRepository } from './donationInject';
import { GetLotsUseCase } from '../../useCase/lot/GetLotsUseCase';
import { GetLotByIdUseCase } from '../../useCase/lot/GetLotByIdUseCase';
import { TransitionLotStatusUseCase } from '../../useCase/lot/TransitionLotStatusUseCase';
import { GetLotTraceUseCase } from '../../useCase/lot/GetLotTraceUseCase';
import { LotController } from '../../adapters/controllers/lot/LotController';

const getLotsUseCase = new GetLotsUseCase(lotRepository);
const getLotByIdUseCase = new GetLotByIdUseCase(lotRepository);
const transitionLotStatusUseCase = new TransitionLotStatusUseCase(lotRepository, lotEventRepository);
const getLotTraceUseCase = new GetLotTraceUseCase(lotRepository, lotEventRepository, donationRepository);

export const lotController = new LotController(
  getLotsUseCase,
  getLotByIdUseCase,
  transitionLotStatusUseCase,
  getLotTraceUseCase
);
