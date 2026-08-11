"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseManifestUseCase = void 0;
const AppError_1 = require("../../shared/errors/AppError");
class ParseManifestUseCase {
    aiManifestService;
    constructor(aiManifestService) {
        this.aiManifestService = aiManifestService;
    }
    async execute(dto) {
        if (!dto) {
            throw new AppError_1.BadRequestError('Request body is required.');
        }
        const hasText = Boolean(dto.manifestText && typeof dto.manifestText === 'string' && dto.manifestText.trim());
        const hasImage = Boolean(dto.imageBase64 && typeof dto.imageBase64 === 'string' && dto.imageBase64.trim());
        if (!hasText && !hasImage) {
            throw new AppError_1.BadRequestError('Either manifest text or manifest photo image is required.');
        }
        // AI only parses the manifest. It NEVER directly creates donations or lots!
        let parsedResult;
        if (hasImage) {
            parsedResult = await this.aiManifestService.parseManifestImage(dto.imageBase64, dto.mimeType || 'image/jpeg');
        }
        else {
            parsedResult = await this.aiManifestService.parseManifest(dto.manifestText);
        }
        // Perform Schema Validation and Cleaning
        const validatedItems = parsedResult.items.map((item) => {
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
            raw_text: hasImage ? '[Photo Manifest OCR]' : dto.manifestText,
            donor_name: parsedResult.donor_name || null,
            received_date: parsedResult.received_date || null,
            items: validatedItems
        };
    }
    inferCategory(itemName) {
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
exports.ParseManifestUseCase = ParseManifestUseCase;
