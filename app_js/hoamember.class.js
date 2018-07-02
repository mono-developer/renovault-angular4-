"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HoaMember = /** @class */ (function () {
    function HoaMember() {
    }
    HoaMember.parse = function (parsedJsonObject) {
        var p = new HoaMember();
        p.id = parsedJsonObject.id;
        p.hoaid = parsedJsonObject.hoaid;
        p.objectid = parsedJsonObject.objectid;
        p.objectdisplaystring = parsedJsonObject.objectdisplaystring;
        p.ownerpartyid = parsedJsonObject.ownerpartyid;
        p.ownerpartydisplaystring = parsedJsonObject.ownerpartydisplaystring;
        p.ownerpartyemail = parsedJsonObject.ownerpartyemail;
        return p;
    };
    return HoaMember;
}());
exports.HoaMember = HoaMember;
