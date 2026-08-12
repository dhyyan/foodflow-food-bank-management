import { lotRepository, lotEventRepository } from './donationInject';
import { RecipientRepository } from '../../adapters/repository/recipient/RecipientRepository';
import { ReservationRepository } from '../../adapters/repository/reservation/ReservationRepository';
import { DistributionRepository } from '../../adapters/repository/distribution/DistributionRepository';

import { CreateRecipientUseCase } from '../../useCase/recipient/CreateRecipientUseCase';
import { GetRecipientsUseCase } from '../../useCase/recipient/GetRecipientsUseCase';
import { CheckRecipientQuotaUseCase } from '../../useCase/recipient/CheckRecipientQuotaUseCase';

import { CreateDistributionUseCase } from '../../useCase/distribution/CreateDistributionUseCase';
import { PreviewFEFOUseCase } from '../../useCase/distribution/PreviewFEFOUseCase';
import { ReserveStockUseCase } from '../../useCase/distribution/ReserveStockUseCase';
import { CompleteDistributionUseCase } from '../../useCase/distribution/CompleteDistributionUseCase';
import { GetDistributionByIdUseCase } from '../../useCase/distribution/GetDistributionByIdUseCase';
import { GetDistributionsUseCase } from '../../useCase/distribution/GetDistributionsUseCase';

import { RecipientController } from '../../adapters/controllers/recipient/RecipientController';
import { DistributionController } from '../../adapters/controllers/distribution/DistributionController';

export const recipientRepository = new RecipientRepository();
export const reservationRepository = new ReservationRepository();
export const distributionRepository = new DistributionRepository();

const createRecipientUseCase = new CreateRecipientUseCase(recipientRepository);
const getRecipientsUseCase = new GetRecipientsUseCase(recipientRepository);
const checkRecipientQuotaUseCase = new CheckRecipientQuotaUseCase(recipientRepository, distributionRepository);

export const recipientController = new RecipientController(
  createRecipientUseCase,
  getRecipientsUseCase,
  checkRecipientQuotaUseCase
);

const createDistributionUseCase = new CreateDistributionUseCase(distributionRepository, recipientRepository);
const previewFEFOUseCase = new PreviewFEFOUseCase(distributionRepository, lotRepository);
const reserveStockUseCase = new ReserveStockUseCase(
  distributionRepository,
  recipientRepository,
  lotRepository,
  reservationRepository,
  lotEventRepository
);
const completeDistributionUseCase = new CompleteDistributionUseCase(
  distributionRepository,
  lotRepository,
  reservationRepository,
  lotEventRepository
);
const getDistributionByIdUseCase = new GetDistributionByIdUseCase(distributionRepository, reservationRepository);
const getDistributionsUseCase = new GetDistributionsUseCase(distributionRepository, reservationRepository);

export const distributionController = new DistributionController(
  createDistributionUseCase,
  previewFEFOUseCase,
  reserveStockUseCase,
  completeDistributionUseCase,
  getDistributionByIdUseCase,
  getDistributionsUseCase
);
