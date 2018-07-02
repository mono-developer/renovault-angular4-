"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Party = /** @class */ (function () {
    function Party() {
    }
    Party.prototype.getTable = function () {
        return 'party';
    };
    Party.prototype.getId = function () {
        return this.id;
    };
    Party.prototype.getGranteerole = function () {
        throw new Error("Cannot getGranteerole from Party...");
    };
    Party.prototype.setGranteerole = function (r) {
        throw new Error("Cannot setGranteerole on Party...");
    };
    Party.prototype.getDisplayString = function () {
        return this.displayname;
    };
    Party.prototype.getDisplayHTML = function () {
        var s;
        s = this.getDisplayString();
        s = this.escapeHtml(s);
        return s;
    };
    Party.parse = function (parsedJsonObject) {
        var p = new Party();
        p.id = parsedJsonObject.id;
        p.partytype = parsedJsonObject.partytype;
        p.displayname = parsedJsonObject.displayname;
        p.title = parsedJsonObject.title;
        p.firstname = parsedJsonObject.firstname;
        p.infixname = parsedJsonObject.infixname;
        p.lastname = parsedJsonObject.lastname;
        p.companykvknumber = parsedJsonObject.companykvknumber;
        p.companyname = parsedJsonObject.companyname;
        p.postalcode = parsedJsonObject.postalcode;
        p.housenumber = parsedJsonObject.housenumber;
        p.housenumberadd = parsedJsonObject.housenumberadd;
        p.street = parsedJsonObject.street;
        p.city = parsedJsonObject.city;
        p.email = parsedJsonObject.email;
        p.phone = parsedJsonObject.phone;
        p.bankaccount = parsedJsonObject.bankaccount;
        return p;
    };
    Party.prototype.escapeHtml = function (s) {
        s = s.replace('&', '&amp;');
        s = s.replace('<', '&lt;');
        s = s.replace('>', '&gt;');
        s = s.replace('"', '&quot;');
        s = s.replace("'", '&#39;');
        s = s.replace('/', '&#x2F;');
        s = s.replace('`', '&#x60;');
        s = s.replace('=', '&#x3D;');
        return s;
    };
    return Party;
}());
exports.Party = Party;
