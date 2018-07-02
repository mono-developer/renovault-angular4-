"use strict";
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
var message_service_1 = require("./message.service");
var BeanService = /** @class */ (function () {
    function BeanService(http, messageService) {
        this.http = http;
        this.messageService = messageService;
        this.apiBase = '/api';
        this.apiName = '';
        this.headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true'
        });
        this.options = new http_1.RequestOptions({ headers: this.headers, withCredentials: true });
    }
    BeanService.prototype.getApiBase = function () {
        return this.apiBase;
    };
    BeanService.prototype.getApiUrl = function () {
        return this.getApiBase() + '/' + this.getApiName();
    };
    BeanService.prototype.getCrudApiUrl = function () {
        return this.getApiBase() + '/crud/' + this.getApiName();
    };
    BeanService.prototype.getBeans = function () {
        var _this = this;
        return this.http.get(this.getCrudApiUrl())
            .toPromise()
            .then(function (response) {
            return response.json().data;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    BeanService.prototype.getBean = function (id) {
        return this.getBeans()
            .then(function (beans) { return beans.find(function (bean) { return bean.id == id; }); });
    };
    BeanService.prototype.addNewBean = function (newBean) {
        var _this = this;
        return this.http
            .post(this.getCrudApiUrl(), JSON.stringify(newBean), this.options)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(function (error) { return _this.handleError(error); });
    };
    BeanService.prototype.updateBean = function (bean) {
        var _this = this;
        var url = this.getCrudApiUrl() + "/" + bean.id;
        return this.http
            .post(url, JSON.stringify(bean), this.options)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(function (error) { return _this.handleError(error); });
    };
    BeanService.prototype.deleteBean = function (bean) {
        var _this = this;
        var url = this.getCrudApiUrl() + "/" + bean.id;
        return this.http
            .delete(url, this.options)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(function (error) { return _this.handleError(error); });
    };
    BeanService.prototype.handleError = function (error) {
        this.messageService.sendMessage(error, error._body);
        return Promise.resolve(null);
    };
    BeanService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, message_service_1.MessageService])
    ], BeanService);
    return BeanService;
}());
exports.BeanService = BeanService;
