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
var bean_service_1 = require("./bean.service");
var message_service_1 = require("./message.service");
var SecurityService = /** @class */ (function (_super) {
    __extends(SecurityService, _super);
    function SecurityService(http, messageService) {
        var _this = _super.call(this, http, messageService) || this;
        _this.http = http;
        _this.messageService = messageService;
        _this.apiName = 'security';
        return _this;
    }
    SecurityService.prototype.getApiName = function () {
        return this.apiName;
    };
    SecurityService.prototype.getSecurityRecords = function () {
        return this.getBeans();
    };
    SecurityService.prototype.getSecurity = function (id) {
        return this.getBean(id);
    };
    SecurityService.prototype.getSecurityForTable = function (referencetable, referenceid) {
        var _this = this;
        return this.http
            .get(this.getApiUrl() + '/' + referencetable + '/' + referenceid)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .then(function (security) {
            return security;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    SecurityService.prototype.addNewSecurity = function (security) {
        var _this = this;
        return this.http
            .post(this.getApiUrl(), JSON.stringify(security), this.options)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .then(function (security) {
            return security;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    SecurityService.prototype.updateSecurity = function (security) {
        var _this = this;
        var url = this.getApiUrl() + "/" + security.id;
        return this.http
            .post(url, JSON.stringify(security), this.options)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(function (error) { return _this.handleError(error); });
    };
    SecurityService.prototype.deleteSecurity = function (toDelete) {
        var _this = this;
        var url = this.getApiUrl() + "/" + toDelete.id;
        return this.http
            .delete(url, this.options)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(function (error) { return _this.handleError(error); });
    };
    SecurityService.prototype.transferSecurity = function (transferFrom, transferTo) {
        var _this = this;
        var url = this.getApiUrl() + "/transfer/" + transferFrom.id + "/" + transferTo.id;
        return this.http
            .post(url, this.options)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(function (error) { return _this.handleError(error); });
    };
    SecurityService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, message_service_1.MessageService])
    ], SecurityService);
    return SecurityService;
}(bean_service_1.BeanService));
exports.SecurityService = SecurityService;
