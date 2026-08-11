"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipient = void 0;
class Recipient {
    id;
    name;
    type;
    monthlyQuota;
    contactPerson;
    contactEmail;
    address;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.name = props.name.trim();
        this.type = props.type;
        this.monthlyQuota = props.monthlyQuota ?? (props.type === 'family' ? 50 : 0);
        this.contactPerson = props.contactPerson ? props.contactPerson.trim() : undefined;
        this.contactEmail = props.contactEmail ? props.contactEmail.trim().toLowerCase() : undefined;
        this.address = props.address ? props.address.trim() : undefined;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}
exports.Recipient = Recipient;
