"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Donation = void 0;
class Donation {
    id;
    donationNumber;
    donorName;
    donorType;
    receivedAt;
    receivedBy;
    lines;
    notes;
    status;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.donationNumber = props.donationNumber;
        this.donorName = props.donorName.trim();
        this.donorType = props.donorType.trim();
        this.receivedAt = props.receivedAt ? new Date(props.receivedAt) : new Date();
        this.receivedBy = props.receivedBy;
        this.lines = props.lines;
        this.notes = props.notes?.trim();
        this.status = props.status || 'received';
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}
exports.Donation = Donation;
