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
var bean_service_1 = require("./bean.service");
var message_service_1 = require("./message.service");
var WizardService = /** @class */ (function (_super) {
    __extends(WizardService, _super);
    function WizardService(http, messageService) {
        var _this = _super.call(this, http, messageService) || this;
        _this.http = http;
        _this.messageService = messageService;
        _this.apiName = 'questions';
        return _this;
    }
    WizardService.prototype.getApiName = function () {
        return this.apiName;
    };
    WizardService.prototype.getNextQuestion = function () {
        var _this = this;
        return this.http.get(this.getApiUrl() + '/next')
            .toPromise()
            .then(function (response) {
            _this.question = response.json().data;
            return _this.question;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    WizardService.prototype.resetQuestions = function () {
        var _this = this;
        return this.http.get(this.getApiUrl() + '/reset')
            .toPromise()
            .then()
            .catch(function (error) { return _this.handleError(error); });
    };
    WizardService.prototype.answerQuestion = function (question, answer) {
        var _this = this;
        return this.http.post(this.getApiUrl() + '/answer/' + question + '/' + answer, {}, this.options)
            .toPromise()
            .then(function (response) {
            _this.question = response.json().data;
            return _this.question;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    WizardService.prototype.getRootQuestion = function (treename, reference_table, reference_id, reference_string) {
        var _this = this;
        return this.http.get(this.getApiUrl() + '/root/' + treename + '/' + reference_table + '/' + reference_id + '/' + reference_string)
            .toPromise()
            .then(function (response) {
            return response.json().data;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    WizardService.prototype.getQuestionsWithTag = function (tagname) {
        var _this = this;
        return this.http.get(this.getApiUrl() + '/tagged/' + tagname)
            .toPromise()
            .then(function (response) {
            _this.question = response.json().data;
            return _this.question;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    WizardService.prototype.getQuestionAfterAnswer = function (question_id, answer_id, reference_table, reference_id, reference_string) {
        var _this = this;
        return this.http.get(this.getApiUrl() + '/after/' + question_id + '/' + answer_id + '/' + reference_table + '/' + reference_id + '/' + reference_string)
            .toPromise()
            .then(function (response) {
            return response.json().data;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    // getQuestionInstances(reference_table: string, reference_id: number, reference_string: string) {
    // 	return this.http.get(this.getApiUrl() + '/instances/' + reference_table + '/' + reference_id + '/' + reference_string)
    // 		.toPromise()
    // 		.then((response: Response) => response.json().data as QuestionInstance[])
    // 		.catch((error: any) => this.handleError(error));
    // }
    WizardService.prototype.getQuestionInstance = function (reference_table, reference_id, reference_string, question_id) {
        var _this = this;
        return this.http.get(this.getApiUrl() + '/questioninstance/' + reference_table + '/' + reference_id + '/' + reference_string + '/' + question_id)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(function (error) { return _this.handleError(error); });
    };
    WizardService.prototype.updateQuestionInstance = function (instance) {
        var _this = this;
        return this.http.post(this.getApiUrl() + '/questioninstance/' + instance.id, JSON.stringify(instance), this.options)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(function (error) { return _this.handleError(error); });
    };
    WizardService.prototype.updateQuestionInstances = function (instances) {
        var _this = this;
        return this.http.post(this.getApiUrl() + '/questioninstance/multiple', JSON.stringify(instances), this.options)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(function (error) { return _this.handleError(error); });
    };
    // getQuestionProgress(reference_table: string, reference_id: number, reference_string: string) {
    // 	var url: string = this.getApiUrl() + '/progress/' + reference_table + '/' + reference_id + '/' + reference_string;
    // 	return this.http.get(url)
    // 		.toPromise()
    // 		.then((response: Response) => response.json().data as QuestionInstance[])
    // 		.catch((error: any) => this.handleError(error));
    // }
    WizardService.prototype.getQuestion = function (id) {
        var _this = this;
        return this.http.get(this.getApiUrl() + '/' + id)
            .toPromise()
            .then(function (response) {
            return response.json().data;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    WizardService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, message_service_1.MessageService])
    ], WizardService);
    return WizardService;
}(bean_service_1.BeanService));
exports.WizardService = WizardService;
