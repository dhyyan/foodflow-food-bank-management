import { IDonationRepository } from '../../domain/interface/repositoryInterface/IDonationRepository';
import { DonationFilterDTO, DonationResponseDTO, DonationLineResponseDTO } from '../../domain/interface/DTOs/DonationDTO';

export interface IGetDonationsUseCase {
  execute(filter?: DonationFilterDTO): Promise<{
    donations: DonationResponseDTO[];
    total: number;
    page: number;
    limit: number;
  }>;
}

export class GetDonationsUseCase implements IGetDonationsUseCase {
  constructor(private readonly donationRepository: IDonationRepository) {}

  async execute(filter?: DonationFilterDTO): Promise<{
    donations: DonationResponseDTO[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = filter?.page || 1;
    const limit = filter?.limit || 20;

    const { donations, total } = await this.donationRepository.findAll(filter);

    const donationDTOs: DonationResponseDTO[] = donations.map((d) => ({
      id: d.id!,
      donationNumber: d.donationNumber,
      donorName: d.donorName,
      donorType: d.donorType,
      receivedAt: d.receivedAt.toISOString(),
      receivedBy: d.receivedBy,
      lines: d.lines.map((l): DonationLineResponseDTO => ({
        id: l.id,
        itemName: l.itemName,
        category: l.category || 'General',
        quantity: l.quantity,
        unit: l.unit,
        printedExpiryDate: l.printedExpiryDate ? l.printedExpiryDate.toISOString() : undefined,
        notes: l.notes
      })),
      totalLines: d.lines.length,
      totalQuantity: d.lines.reduce((sum, l) => sum + l.quantity, 0),
      notes: d.notes,
      status: d.status,
      createdAt: d.createdAt ? d.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: d.updatedAt ? d.updatedAt.toISOString() : new Date().toISOString()
    }));

    return {
      donations: donationDTOs,
      total,
      page,
      limit
    };
  }
}
