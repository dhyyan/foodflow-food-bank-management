"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
class AIController {
    parseManifestUseCase;
    constructor(parseManifestUseCase) {
        this.parseManifestUseCase = parseManifestUseCase;
    }
    parseManifest = async (req, res, next) => {
        try {
            const { manifestText, imageBase64, mimeType } = req.body;
            const result = await this.parseManifestUseCase.execute({
                manifestText,
                imageBase64,
                mimeType
            });
            res.status(200).json({
                success: true,
                message: 'Manifest parsed successfully into structured JSON',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    parseManifestImage = async (req, res, next) => {
        try {
            const { imageBase64, mimeType } = req.body;
            const result = await this.parseManifestUseCase.execute({
                imageBase64,
                mimeType
            });
            res.status(200).json({
                success: true,
                message: 'Manifest photo parsed successfully into structured JSON',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AIController = AIController;
