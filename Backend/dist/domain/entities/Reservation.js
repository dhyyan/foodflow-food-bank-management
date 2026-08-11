"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
class Reservation {
    id;
    distributionId;
    lotId;
    lotNumber;
    itemName;
    quantity;
    unit;
    status;
    createdBy;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.distributionId = props.distributionId;
        this.lotId = props.lotId;
        this.lotNumber = props.lotNumber;
        this.itemName = props.itemName;
        this.quantity = props.quantity;
        this.unit = props.unit;
        this.status = props.status;
        this.createdBy = props.createdBy;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}
exports.Reservation = Reservation;
