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
var message_service_1 = require("./message.service");
var bean_service_1 = require("./bean.service");
var angular_translator_1 = require("angular-translator");
var ContentService = /** @class */ (function (_super) {
    __extends(ContentService, _super);
    function ContentService(http, messageService, translateService) {
        var _this = _super.call(this, http, messageService) || this;
        _this.http = http;
        _this.messageService = messageService;
        _this.translateService = translateService;
        _this.apiName = 'contentitem';
        _this.contents = Array();
        _this.http.get(_this.getApiUrl() + '/getSessionLanguage')
            .toPromise()
            .then(function (response) {
            return response.json().data;
        })
            .then(function (data) {
            _this.language = data;
            _this.getContents();
            // console.log(this.contents);
        })
            .catch(function (error) { return _this.handleError(error); });
        return _this;
    }
    ContentService.prototype.getApiName = function () {
        return this.apiName;
    };
    ContentService.prototype.getContents = function () {
        if (this.contents.length == 0) {
            this.contents = Array();
            this.addContentItem('app.menu.home1');
            this.addContentItem('app.menu.home2');
            this.addContentItem('app.menu.home3');
            this.addContentItem('app.menu.home4');
            this.addContentItem('app.menu.home1.link');
            this.addContentItem('app.menu.home2.link');
            this.addContentItem('app.menu.home3.link');
            this.addContentItem('app.menu.home4.link');
            this.addContentItem('app.menu.objects');
            this.addContentItem('app.menu.hoas');
            this.addContentItem('app.menu.projects');
            this.addContentItem('app.menu.parties');
            this.addContentItem('app.menu.partyaccount');
            this.addContentItem('app.menu.partyaccount.partiessignedinparty');
            this.addContentItem('app.menu.partyaccount.partyaccount');
            this.addContentItem('app.menu.partyaccount.logoff');
            this.addContentItem('app.menu.partyaccount.logon');
            this.addContentItem('app.menu.partyaccount.extraentry1');
            this.addContentItem('app.menu.partyaccount.extraentry2');
            this.addContentItem('app.menu.partyaccount.extraentry3');
            this.addContentItem('app.menu.partyaccount.extraentry4');
            this.addContentItem('app.menu.partyaccount.extraentry5');
            this.addContentItem('home.text1');
            this.addContentItem('home.text2');
            this.addContentItem('home.text3');
            this.addContentItem('home.text4');
            this.addContentItem('home.text5');
            this.addContentItem('home.text6');
            this.addContentItem('objectdetail.heading1');
            this.addContentItem('objectdetail.heading2');
            this.addContentItem('objectdetail.heading3');
            this.addContentItem('objectdetail.heading4');
            this.addContentItem('objectdetail.heading5');
            this.addContentItem('objectdetail.heading6');
            this.addContentItem('hoadetail.heading1');
            this.addContentItem('hoadetail.heading2');
            this.addContentItem('hoadetail.heading3');
            this.addContentItem('hoadetail.heading4');
            this.addContentItem('hoadetail.heading5');
            this.addContentItem('hoadetail.heading6');
            this.addContentItem('site.title');
            this.addContentItem('site.subtitle');
            this.addContentItem('site.logo');
            this.addContentItem('site.button.add');
            this.addContentItem('site.button.select');
            this.addContentItem('site.button.details');
            this.addContentItem('site.button.delete');
            this.addContentItem('site.button.save');
            this.addContentItem('site.button.share');
            this.addContentItem('partyaccount.heading1');
            this.addContentItem('partyaccount.heading2');
            this.addContentItem('partyaccount.heading3');
            this.addContentItem('partyaccount.heading4');
            this.addContentItem('partyaccount.heading5');
            this.addContentItem('partyaccount.heading6');
            this.addContentItem('partyaccount.button.multipleobjects');
            this.addContentItem('partyaccount.button.logoff');
            this.addContentItem('partyaccount.button.logon');
            this.addContentItem('partyaccount.button.register');
            this.addContentItem('partyaccount.button.modify');
            this.addContentItem('partyaccount.button.send');
            this.addContentItem('partyaccount.accepttermsmessage');
            this.addContentItem('party.heading1');
            this.addContentItem('projects.modal.title');
            this.addContentItem('projectdetail.heading1');
            this.addContentItem('projectdetail.heading2');
            this.addContentItem('projectdetail.heading3');
            this.addContentItem('projectdetail.heading4');
            this.addContentItem('projectdetail.heading5');
            this.addContentItem('projectdetail.button.finished');
        }
    };
    // getContent(name: string): string {
    // 	return this.contents[name];
    // }
    ContentService.prototype.getContentItem = function (item) {
        return this.translateService.translate(item, null, this.language);
    };
    ContentService.prototype.addContentItem = function (item) {
        var _this = this;
        this.getContentItem(item)
            .then(function (t) {
            _this.contents[item] = t;
        });
    };
    ContentService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, message_service_1.MessageService, angular_translator_1.Translator])
    ], ContentService);
    return ContentService;
}(bean_service_1.BeanService));
exports.ContentService = ContentService;
