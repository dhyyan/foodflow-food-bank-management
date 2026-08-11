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
exports.DonationModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DonationLineSchema = new mongoose_1.Schema({
    itemName: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    category: {
        type: String,
        default: 'General',
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0.01, 'Quantity must be greater than zero']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        trim: true
    },
    printedExpiryDate: {
        type: Date,
        required: false
    },
    notes: {
        type: String,
        trim: true
    }
}, { _id: true });
const DonationSchema = new mongoose_1.Schema({
    donationNumber: {
        type: String,
        required: [true, 'Donation number is required'],
        unique: true,
        index: true
    },
    donorName: {
        type: String,
        required: [true, 'Donor name is required'],
        trim: true,
        index: true
    },
    donorType: {
        type: String,
        required: [true, 'Donor type is required'],
        trim: true,
        index: true
    },
    receivedAt: {
        type: Date,
        default: Date.now
    },
    receivedBy: {
        id: {
            type: mongoose_1.Schema.Types.Mixed,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    lines: {
        type: [DonationLineSchema],
        validate: [
            (val) => val && val.length > 0,
            'Donation must contain at least one line item'
        ]
    },
    notes: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['received', 'processed', 'cancelled'],
        default: 'received'
    }
}, {
    timestamps: true
});
exports.DonationModel = mongoose_1.default.model('Donation', DonationSchema);
