"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["DONATION_CLERK"] = "donation_clerk";
    UserRole["STOCK_MANAGER"] = "stock_manager";
    UserRole["HANDOUT_COORDINATOR"] = "handout_coordinator";
})(UserRole || (exports.UserRole = UserRole = {}));
class User {
    id;
    name;
    email;
    passwordHash;
    role;
    isActive;
    createdBy;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.email = props.email.toLowerCase().trim();
        this.passwordHash = props.passwordHash;
        this.role = props.role;
        this.isActive = props.isActive ?? true;
        this.createdBy = props.createdBy;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}
exports.User = User;
