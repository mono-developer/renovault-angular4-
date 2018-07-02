"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PartyAccount = /** @class */ (function () {
    function PartyAccount() {
        this.multipleobjects = false;
    }
    PartyAccount.parse = function (parsedJsonObject) {
        if (parsedJsonObject != null) {
            if (parsedJsonObject.multipleobjects != 0) {
                parsedJsonObject.multipleobjects = true;
            }
            else {
                parsedJsonObject.multipleobjects = false;
            }
        }
        return parsedJsonObject;
    };
    return PartyAccount;
}());
exports.PartyAccount = PartyAccount;
