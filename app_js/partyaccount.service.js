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
var partyaccount_class_1 = require("./partyaccount.class");
var bean_service_1 = require("./bean.service");
var message_service_1 = require("./message.service");
var PartyAccountService = /** @class */ (function (_super) {
    __extends(PartyAccountService, _super);
    function PartyAccountService(http, messageService) {
        var _this = _super.call(this, http, messageService) || this;
        _this.http = http;
        _this.messageService = messageService;
        _this.apiName = 'partyaccount';
        _this.signedInPartyAccount = null;
        _this.signedInParty = null;
        _this.forceUpdate();
        return _this;
    }
    PartyAccountService.prototype.forceUpdate = function () {
        var _this = this;
        this.getSignedInPartyAccount()
            .then(function (pa) {
            _this.signedInPartyAccount = pa;
        })
            .catch(function (error) { return _this.handleError(error); });
        this.getSignedInParty()
            .then(function (p) {
            _this.signedInParty = p;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyAccountService.prototype.getApiName = function () {
        return this.apiName;
    };
    PartyAccountService.prototype.getPartyAccounts = function () {
        if (this.parties == null) {
            return this.getBeans();
        }
        else {
            return Promise.resolve(this.parties);
        }
    };
    PartyAccountService.prototype.getPartyAccount = function (id) {
        var _this = this;
        return this.getPartyAccounts()
            .then(function (parties) { return parties.find(function (party) { return party.id == id; }); })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyAccountService.prototype.getSignedInPartyAccount = function () {
        var _this = this;
        return this.http.get(this.getApiUrl() + '/signedInPartyAccount')
            .toPromise()
            .then(function (response) {
            var p;
            p = partyaccount_class_1.PartyAccount.parse(response.json().data);
            _this.signedInPartyAccount = p;
            return _this.signedInPartyAccount;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyAccountService.prototype.getSignedInParty = function () {
        var _this = this;
        return this.http.get(this.getApiUrl() + '/signedInParty')
            .toPromise()
            .then(function (response) {
            var p;
            p = response.json().data;
            _this.signedInParty = p;
            return _this.signedInParty;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyAccountService.prototype.getPartyAccountIsSignedIn = function () {
        var _this = this;
        return this.getSignedInPartyAccount()
            .then(function (p) {
            return _this.signedInPartyAccount != null;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyAccountService.prototype.signOut = function () {
        var _this = this;
        return this.http.post(this.getApiUrl() + '/signOut', {}, this.options)
            .toPromise()
            .then(function (response) {
            _this.forceUpdate();
            return true;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyAccountService.prototype.signIn = function (login, password) {
        var _this = this;
        var signInParty = new partyaccount_class_1.PartyAccount();
        signInParty.login = login;
        signInParty.password = password;
        return this.http.post(this.getApiUrl() + '/signIn', JSON.stringify(signInParty), this.options)
            .toPromise()
            .then(function (response) {
            _this.forceUpdate();
            return response.json().data;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyAccountService.prototype.register = function (login, password) {
        var _this = this;
        var p = new partyaccount_class_1.PartyAccount();
        p.login = login;
        p.password = password;
        return this.http.post(this.getApiUrl() + '/register', JSON.stringify(p), this.options)
            .toPromise()
            .then(function (response) {
            return response.json().data;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyAccountService.prototype.confirmRegistration = function (email, confirmationcode) {
        var _this = this;
        return this.http.post(this.getApiUrl() + '/confirmregistration/' + email + '/' + confirmationcode, JSON.stringify({}), this.options)
            .toPromise()
            .then(function (response) {
            return response.json().data;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyAccountService.prototype.changePassword = function (oldpassword, newpassword) {
        var _this = this;
        var p = {};
        p.oldpassword = oldpassword;
        p.newpassword = newpassword;
        return this.http.post(this.getApiUrl() + '/changePassword', JSON.stringify(p), this.options)
            .toPromise()
            .then(function (response) {
            return response.json().data;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyAccountService.prototype.updatePartyAccount = function (party) {
        var _this = this;
        var url = this.getApiUrl() + "/" + party.id;
        return this.http
            .post(url, JSON.stringify(party), this.options)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyAccountService.prototype.forgotPassword = function (email) {
        var _this = this;
        var p = {};
        p.email = email;
        return this.http.post(this.getApiUrl() + '/forgotpassword', JSON.stringify(p), this.options)
            .toPromise()
            .then(function (response) {
            return response.json().data;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyAccountService.prototype.restorePassword = function (restoreConfirmationCode, restorePasswordEmail, restorePassword) {
        var _this = this;
        var p = {};
        p.restoreConfirmationCode = restoreConfirmationCode;
        p.restorePasswordEmail = restorePasswordEmail;
        p.restorePassword = restorePassword;
        return this.http.post(this.getApiUrl() + '/restorepassword', JSON.stringify(p), this.options)
            .toPromise()
            .then(function (response) {
            return response.json().data;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    PartyAccountService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, message_service_1.MessageService])
    ], PartyAccountService);
    return PartyAccountService;
}(bean_service_1.BeanService));
exports.PartyAccountService = PartyAccountService;
