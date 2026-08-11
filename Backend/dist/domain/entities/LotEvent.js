"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotEvent = void 0;
class LotEvent {
    id;
    lotId;
    eventType;
    previousStatus;
    newStatus;
    performedBy;
    notes;
    timestamp;
    createdAt;
    constructor(props) {
        this.id = props.id;
        this.lotId = props.lotId;
        this.eventType = props.eventType;
        this.previousStatus = props.previousStatus;
        this.newStatus = props.newStatus;
        this.performedBy = props.performedBy;
        this.notes = props.notes;
        this.timestamp = props.timestamp ? new Date(props.timestamp) : new Date();
        this.createdAt = props.createdAt ? new Date(props.createdAt) : this.timestamp;
    }
}
exports.LotEvent = LotEvent;
