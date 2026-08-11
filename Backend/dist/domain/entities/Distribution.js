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
    notes;
    createdBy;
    reservedAt;
    completedAt;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.distributionNumber = props.distributionNumber;
        this.recipientId = props.recipientId;
        this.recipientName = props.recipientName;
        this.recipientType = props.recipientType;
        this.items = props.items;
        this.status = props.status;
        this.notes = props.notes;
        this.createdBy = props.createdBy;
        this.reservedAt = props.reservedAt;
        this.completedAt = props.completedAt;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}
exports.Distribution = Distribution;
