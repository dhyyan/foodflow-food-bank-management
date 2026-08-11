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
exports.LotEventModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LotEventSchema = new mongoose_1.Schema({
    lotId: {
        type: mongoose_1.Schema.Types.Mixed,
        required: [true, 'Lot ID is required'],
        index: true
    },
    eventType: {
        type: String,
        required: [true, 'Event type is required'],
        trim: true
    },
    previousStatus: {
        type: String,
        required: false
    },
    newStatus: {
        type: String,
        required: [true, 'New status is required']
    },
    performedBy: {
        id: {
            type: mongoose_1.Schema.Types.Mixed,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: false
        }
    },
    notes: {
        type: String,
        required: false,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});
exports.LotEventModel = mongoose_1.default.model('LotEvent', LotEventSchema);
