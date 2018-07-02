"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectBean = /** @class */ (function () {
    function ObjectBean() {
    }
    ObjectBean.prototype.getTable = function () {
        return 'object';
    };
    ObjectBean.prototype.getId = function () {
        return this.id;
    };
    ObjectBean.prototype.getGranteerole = function () {
        return this.granteerole;
    };
    ObjectBean.prototype.setGranteerole = function (r) {
        this.granteerole = r;
    };
    ObjectBean.prototype.getAddressDescription = function () {
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
    ObjectBean.prototype.getDisplayString = function () {
        return this.getAddressDescription();
    };
    ObjectBean.prototype.hasAddress = function () {
        return this.getAddressDescription().length > 0;
    };
    ObjectBean.parse = function (parsedJsonObject) {
        var p = new ObjectBean();
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
        p.owner = parsedJsonObject.owner;
        p.ownersinceyear = parsedJsonObject.ownersinceyear;
        p.objecttype = parsedJsonObject.objecttype;
        p.objectsubtype = parsedJsonObject.objectsubtype;
        p.objectposition = parsedJsonObject.objectposition;
        p.constructionyear = parsedJsonObject.constructionyear;
        p.livingsurface = parsedJsonObject.livingsurface;
        p.volume = parsedJsonObject.volume;
        p.outsidesurface = parsedJsonObject.outsidesurface;
        p.lotsurface = parsedJsonObject.lotsurface;
        p.nooffloors = parsedJsonObject.nooffloors;
        p.noofrooms = parsedJsonObject.noofrooms;
        p.noofwetrooms = parsedJsonObject.noofwetrooms;
        p.noofbasements = parsedJsonObject.noofbasements;
        p.noofbalconies = parsedJsonObject.noofbalconies;
        p.familyadults = parsedJsonObject.familyadults;
        p.familychildren = parsedJsonObject.familychildren;
        p.goals = parsedJsonObject.goals;
        p.securityid = parsedJsonObject.securityid;
        return p;
    };
    return ObjectBean;
}());
exports.ObjectBean = ObjectBean;
