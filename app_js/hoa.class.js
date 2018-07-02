"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Hoa = /** @class */ (function () {
    function Hoa() {
    }
    Hoa.prototype.getTable = function () {
        return 'hoa';
    };
    Hoa.prototype.getId = function () {
        return this.id;
    };
    Hoa.prototype.getGranteerole = function () {
        return this.granteerole;
    };
    Hoa.prototype.setGranteerole = function (r) {
        this.granteerole = r;
    };
    Hoa.prototype.getAddressDescription = function () {
        var street = '';
        var housenumber = '';
        var housenumberadd = '';
        if (this.street != null) {
            street = this.street;
        }
        if (this.housenumber != null) {
            housenumber = this.housenumber;
        }
        if (this.housenumberadd != null) {
            housenumberadd = this.housenumberadd;
        }
        var d = street + ' ' + housenumber + ' ' + housenumberadd;
        d = d.trim();
        return d;
    };
    Hoa.prototype.getDisplayString = function () {
        return this.getAddressDescription();
    };
    Hoa.prototype.hasAddress = function () {
        return this.getAddressDescription().length > 0;
    };
    Hoa.parse = function (parsedJsonObject) {
        var p = new Hoa();
        p.id = parsedJsonObject.id;
        p.postalcode = parsedJsonObject.postalcode;
        p.housenumber = parsedJsonObject.housenumber;
        p.housenumberadd = parsedJsonObject.housenumberadd;
        p.street = parsedJsonObject.street;
        p.city = parsedJsonObject.city;
        p.lat = parsedJsonObject.lat;
        p.lon = parsedJsonObject.lon;
        p.lookupdone = parsedJsonObject.lookupdone;
        p.bagurl = parsedJsonObject.bagurl;
        p.houseparts = parsedJsonObject.houseparts;
        p.housepartsexcluded = parsedJsonObject.housepartsexcluded;
        p.tagfilterselection = parsedJsonObject.tagfilterselection;
        p.tagfiltertags = parsedJsonObject.tagfiltertags;
        p.tagfiltertag = parsedJsonObject.tagfiltertag;
        p.granteerole = parsedJsonObject.granteerole;
        // p.owner = parsedJsonObject.owner;
        // p.ownersinceyear = parsedJsonObject.ownersinceyear;
        // p.objecttype = parsedJsonObject.objecttype;
        // p.objectsubtype = parsedJsonObject.objectsubtype;
        // p.objectposition = parsedJsonObject.objectposition;
        p.constructionyear = parsedJsonObject.constructionyear;
        // p.livingsurface = parsedJsonObject.livingsurface;
        // p.volume = parsedJsonObject.volume;
        // p.outsidesurface = parsedJsonObject.outsidesurface;
        // p.lotsurface = parsedJsonObject.lotsurface;
        // p.nooffloors = parsedJsonObject.nooffloors;
        // p.noofrooms = parsedJsonObject.noofrooms;
        // p.noofwetrooms = parsedJsonObject.noofwetrooms;
        // p.noofbasements = parsedJsonObject.noofbasements;
        // p.noofbalconies = parsedJsonObject.noofbalconies;
        // p.familyadults = parsedJsonObject.familyadults;
        // p.familychildren = parsedJsonObject.familychildren;
        p.goals = parsedJsonObject.goals;
        p.securityid = parsedJsonObject.securityid;
        return p;
    };
    return Hoa;
}());
exports.Hoa = Hoa;
