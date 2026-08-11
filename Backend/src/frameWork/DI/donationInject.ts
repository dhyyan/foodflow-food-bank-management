import { DonationRepository } from '../../adapters/repository/donation/DonationRepository';
import { LotRepository } from '../../adapters/repository/lot/LotRepository';
import { CreateDonationUseCase } from '../../useCase/donation/CreateDonationUseCase';
import { GetDonationsUseCase } from '../../useCase/donation/GetDonationsUseCase';
import { GetDonationByIdUseCase } from '../../useCase/donation/GetDonationByIdUseCase';
import { DonationController } from '../../adapters/controllers/donation/DonationController';

export const donationRepository = new DonationRepository();
export const lotRepository = new LotRepository();

const createDonationUseCase = new CreateDonationUseCase(donationRepository, lotRepository);
const getDonationsUseCase = new GetDonationsUseCase(donationRepository);
const getDonationByIdUseCase = new GetDonationByIdUseCase(donationRepository, lotRepository);

export const donationController = new DonationController(
  createDonationUseCase,
  getDonationsUseCase,
  getDonationByIdUseCase
);
