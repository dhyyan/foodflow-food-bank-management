"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lot = exports.LotStatus = void 0;
var LotStatus;
(function (LotStatus) {
    LotStatus["RECEIVED"] = "received";
    LotStatus["CHECKED"] = "checked";
    LotStatus["SHELVED"] = "shelved";
    LotStatus["RESERVED"] = "reserved";
    LotStatus["RELEASED"] = "released";
    LotStatus["QUARANTINED"] = "quarantined";
    LotStatus["DISCARDED"] = "discarded";
})(LotStatus || (exports.LotStatus = LotStatus = {}));
class Lot {
    id;
    lotNumber;
    itemName;
    category;
    quantity;
    availableQuantity;
    unit;
    receivedDate;
    printedExpiryDate;
    safetyMarginDays;
    effectiveExpiryDate;
    donationId;
    donationLineId;
    status;
    createdBy;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.lotNumber = props.lotNumber;
        this.itemName = props.itemName.trim();
        this.category = props.category ? props.category.trim() : 'General';
        this.quantity = props.quantity;
        this.availableQuantity = props.availableQuantity ?? props.quantity;
        this.unit = props.unit.trim();
        this.receivedDate = props.receivedDate ? new Date(props.receivedDate) : new Date();
        this.printedExpiryDate = props.printedExpiryDate ? new Date(props.printedExpiryDate) : undefined;
        this.safetyMarginDays = props.safetyMarginDays ?? 3;
        this.effectiveExpiryDate = props.effectiveExpiryDate
            ? new Date(props.effectiveExpiryDate)
            : Lot.calculateEffectiveExpiryDate(this.printedExpiryDate, this.safetyMarginDays);
        this.donationId = props.donationId;
        this.donationLineId = props.donationLineId;
        this.status = props.status || LotStatus.RECEIVED;
        this.createdBy = props.createdBy;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
    static calculateEffectiveExpiryDate(printedDate, safetyMarginDays = 3) {
        if (!printedDate)
            return undefined;
        const effective = new Date(printedDate.getTime());
        effective.setDate(effective.getDate() - safetyMarginDays);
        return effective;
    }
}
exports.Lot = Lot;
