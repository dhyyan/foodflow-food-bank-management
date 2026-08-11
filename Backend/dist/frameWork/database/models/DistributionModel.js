"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributionModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DistributionSchema = new mongoose_1.Schema({
    distributionNumber: {
        type: String,
        required: [true, 'Distribution number is required'],
        unique: true,
        index: true
    },
    recipientId: {
        type: mongoose_1.Schema.Types.Mixed,
        required: [true, 'Recipient ID is required'],
        index: true
    },
    recipientName: {
        type: String,
        required: [true, 'Recipient name is required'],
        trim: true
    },
    recipientType: {
        type: String,
        enum: ['family', 'agency'],
        required: [true, 'Recipient type is required'],
        index: true
    },
    items: [
        {
            itemName: {
                type: String,
                required: [true, 'Item name is required'],
                trim: true
            },
            requestedQuantity: {
                type: Number,
                required: [true, 'Requested quantity is required'],
                min: [1, 'Requested quantity must be at least 1']
            },
            unit: {
                type: String,
                default: 'units',
                trim: true
            }
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'reserved', 'completed', 'cancelled'],
        default: 'pending',
        index: true
    },
    createdBy: {
        id: {
            type: mongoose_1.Schema.Types.Mixed,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    notes: {
        type: String,
        trim: true
    },
    reservedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});
exports.DistributionModel = mongoose_1.default.model('Distribution', DistributionSchema);
