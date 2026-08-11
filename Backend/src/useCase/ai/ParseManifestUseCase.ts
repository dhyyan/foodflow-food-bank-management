import { IParseManifestUseCase } from '../../domain/interface/useCaseInterface/IParseManifestUseCase';
import { IAIManifestService } from '../../domain/interface/serviceInterface/IAIManifestService';
import { ParseManifestRequestDTO, ManifestParseResultDTO, ParsedManifestItemDTO } from '../../domain/interface/DTOs/ManifestParseDTO';
import { BadRequestError } from '../../shared/errors/AppError';

export class ParseManifestUseCase implements IParseManifestUseCase {
  constructor(private readonly aiManifestService: IAIManifestService) {}

  async execute(dto: ParseManifestRequestDTO): Promise<ManifestParseResultDTO> {
    if (!dto || !dto.manifestText || typeof dto.manifestText !== 'string' || !dto.manifestText.trim()) {
      throw new BadRequestError('Manifest text is required and cannot be empty.');
    }

    // AI only parses the manifest. It NEVER directly creates donations or lots!
    const parsedResult = await this.aiManifestService.parseManifest(dto.manifestText);

    // Perform Schema Validation and Cleaning
    const validatedItems: ParsedManifestItemDTO[] = parsedResult.items.map((item) => {
      let quantity = item.quantity;
      let flagged = item.flagged;
      let flagReason = item.flag_reason;

      // Validate numeric quantity
      if (quantity !== null) {
        if (typeof quantity !== 'number' || isNaN(quantity) || quantity <= 0) {
          quantity = null;
          flagged = true;
          flagReason = flagReason || 'Quantity must be a positive number.';
        }
      }

      // If quantity is null, row MUST be flagged for human review
      if (quantity === null) {
        flagged = true;
        if (!flagReason) {
          flagReason = 'Quantity is unreadable or uncertain and requires manual entry.';
        }
      }

      // Infer category helper
      const inferredCategory = this.inferCategory(item.item_name);

      return {
        item_name: item.item_name.trim(),
        quantity: quantity,
        unit: item.unit ? item.unit.trim() : null,
        expiry_date: item.expiry_date || null,
        flagged: flagged,
        flag_reason: flagReason,
        category: item.category || inferredCategory
      };
    });

    return {
      raw_text: dto.manifestText,
      donor_name: parsedResult.donor_name || null,
      received_date: parsedResult.received_date || null,
      items: validatedItems
    };
  }

  private inferCategory(itemName: string): string {
    const lower = itemName.toLowerCase();
    if (lower.includes('rice') || lower.includes('flour') || lower.includes('grain') || lower.includes('cereal') || lower.includes('wheat') || lower.includes('oats')) {
      return 'Grains';
    }
    if (lower.includes('milk') || lower.includes('cheese') || lower.includes('butter') || lower.includes('yogurt')) {
      return 'Dairy';
    }
    if (lower.includes('egg')) {
      return 'Dairy';
    }
    if (lower.includes('apple') || lower.includes('orange') || lower.includes('banana') || lower.includes('fruit') || lower.includes('potato') || lower.includes('vegetable')) {
      return 'Produce';
    }
    if (lower.includes('can') || lower.includes('bean') || lower.includes('soup') || lower.includes('tuna')) {
      return 'Canned Goods';
    }
    if (lower.includes('bread') || lower.includes('bakery') || lower.includes('bun')) {
      return 'Bakery';
    }
    if (lower.includes('meat') || lower.includes('chicken') || lower.includes('beef') || lower.includes('fish')) {
      return 'Protein';
    }
    if (lower.includes('juice') || lower.includes('water') || lower.includes('soda') || lower.includes('beverage')) {
      return 'Beverages';
    }
    return 'Other';
  }
}
