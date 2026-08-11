"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Distribution = void 0;
class Distribution {
    id;
    distributionNumber;
    recipientId;
    recipientName;
    recipientType;
    items;
    status;
    reservations;
    createdBy;
    notes;
    reservedAt;
    completedAt;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.distributionNumber = props.distributionNumber;
        this.recipientId = props.recipientId;
        this.recipientName = props.recipientName.trim();
        this.recipientType = props.recipientType;
        this.items = props.items.map((item) => ({
            itemName: item.itemName.trim(),
            requestedQuantity: item.requestedQuantity,
            unit: item.unit ? item.unit.trim() : 'units'
        }));
        this.status = props.status || 'pending';
        this.reservations = props.reservations;
        this.createdBy = props.createdBy;
        this.notes = props.notes ? props.notes.trim() : undefined;
        this.reservedAt = props.reservedAt ? new Date(props.reservedAt) : undefined;
        this.completedAt = props.completedAt ? new Date(props.completedAt) : undefined;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}
exports.Distribution = Distribution;
