"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var party_class_1 = require("./party.class");
var bean_service_1 = require("./bean.service");
var message_service_1 = require("./message.service");
var partyaccount_service_1 = require("./partyaccount.service");
var PartyService = /** @class */ (function (_super) {
    __extends(PartyService, _super);
    function PartyService(http, messageService, partyAccountService) {
        var _this = _super.call(this, http, messageService) || this;
        _this.http = http;
        _this.messageService = messageService;
        _this.partyAccountService = partyAccountService;
        _this.apiName = 'party';
        _this.parties = null;
        return _this;
    }
    PartyService.prototype.getApiName = function () {
        return this.apiName;
    };
    PartyService.prototype.getParties = function () {
        var _this = this;
        if (this.parties == null) {
            return this.http.get(this.getApiUrl())
                .toPromise()
                .then(function (response) {
                return response.json().data;
            })
                .then(function (beans) {
                _this.parties = Array();
                beans.forEach(function (value) {
                    _this.parties.push(party_class_1.Party.parse(value));
                });
                return _this.partyAccountService.getSignedInParty()
                    .then(function (sip) {
                    _this.parties = _this.parties.filter(function (p) { return p.id != sip.id; });
                    return _this.parties;
                });
            });
        }
        else {
            return Promise.resolve(this.parties);
        }
    };
    PartyService.prototype.getParty = function (id) {
        var _this = this;
        return this.getParties()
            .then(function (parties) { return parties.find(function (party) { return party.id == id; }); })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyService.prototype.getPartyByEmail = function (email) {
        var _this = this;
        return this.getParties()
            .then(function (parties) { return parties.find(function (party) {
            if (party.email != undefined && party.email != null && email != undefined && email != null) {
                return party.email.toLowerCase() == email.toLowerCase();
            }
            return false;
        }); })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyService.prototype.addNewParty = function () {
        var _this = this;
        var p = new party_class_1.Party();
        return this.http.post(this.getApiUrl(), JSON.stringify(p), this.options)
            .toPromise()
            .then(function (p) {
            var party = party_class_1.Party.parse(p.json().data);
            return _this.getParties().then(function (parties) {
                _this.parties.push(party);
                return party;
            });
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyService.prototype.updateParty = function (p) {
        var _this = this;
        var url = this.getApiUrl() + "/" + p.id;
        return this.getPartyByEmail(p.email)
            .then(function (sameParty) {
            if (sameParty == undefined || sameParty.id == p.id) {
                return _this.http
                    .post(url, JSON.stringify(p), _this.options)
                    .toPromise()
                    .then(function (response) {
                    var o = response.json().data;
                    return _this.getParties()
                        .then(function (parties) {
                        var index = parties.findIndex(function (party) {
                            return party.id == o.id;
                        });
                        _this.parties[index] = party_class_1.Party.parse(o);
                        return o;
                    });
                });
            }
            else {
                throw new Error("Een contact met emailadres " + p.email + " bestaat reeds.");
            }
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyService.prototype.deleteParty = function (party) {
        var _this = this;
        var url = this.getApiUrl() + "/" + party.id;
        return this.http
            .delete(url, this.options)
            .toPromise()
            .then(function (p) {
            _this.parties = _this.parties.filter(function (o) { return o.id !== party.id; });
            return party_class_1.Party.parse(p);
        });
    };
    PartyService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, message_service_1.MessageService, partyaccount_service_1.PartyAccountService])
    ], PartyService);
    return PartyService;
}(bean_service_1.BeanService));
exports.PartyService = PartyService;
