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
exports.LotModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Lot_1 = require("../../../domain/entities/Lot");
const LotSchema = new mongoose_1.Schema({
    lotNumber: {
        type: String,
        required: [true, 'Lot number is required'],
        unique: true,
        index: true
    },
    itemName: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
        index: true
    },
    category: {
        type: String,
        default: 'General',
        trim: true,
        index: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative']
    },
    availableQuantity: {
        type: Number,
        required: [true, 'Available quantity is required'],
        min: [0, 'Available quantity cannot be negative']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        trim: true
    },
    receivedDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    printedExpiryDate: {
        type: Date,
        required: false,
        index: true
    },
    safetyMarginDays: {
        type: Number,
        default: 3
    },
    effectiveExpiryDate: {
        type: Date,
        required: false,
        index: true
    },
    donationId: {
        type: mongoose_1.Schema.Types.Mixed,
        required: [true, 'Donation ID is required'],
        index: true
    },
    donationLineId: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false
    },
    status: {
        type: String,
        enum: Object.values(Lot_1.LotStatus),
        default: Lot_1.LotStatus.RECEIVED,
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
    }
}, {
    timestamps: true
});
exports.LotModel = mongoose_1.default.model('Lot', LotSchema);
