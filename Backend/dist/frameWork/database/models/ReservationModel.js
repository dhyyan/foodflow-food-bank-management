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
exports.ReservationModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ReservationSchema = new mongoose_1.Schema({
    distributionId: {
        type: mongoose_1.Schema.Types.Mixed,
        required: [true, 'Distribution ID is required'],
        index: true
    },
    lotId: {
        type: mongoose_1.Schema.Types.Mixed,
        required: [true, 'Lot ID is required'],
        index: true
    },
    lotNumber: {
        type: String,
        required: [true, 'Lot number is required'],
        index: true
    },
    itemName: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
        index: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['reserved', 'released', 'cancelled'],
        default: 'reserved',
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
exports.ReservationModel = mongoose_1.default.model('Reservation', ReservationSchema);
