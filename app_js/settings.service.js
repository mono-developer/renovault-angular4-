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
var SettingsService = /** @class */ (function (_super) {
    __extends(SettingsService, _super);
    function SettingsService(http, messageService) {
        var _this = _super.call(this, http, messageService) || this;
        _this.http = http;
        _this.messageService = messageService;
        _this.apiName = 'settings';
        _this.settings = null;
        _this.initSettings();
        return _this;
    }
    SettingsService.prototype.getApiName = function () {
        return this.apiName;
    };
    SettingsService.prototype.reloadSettings = function () {
        this.settings = null;
        return this.initSettings()
            .then(function (settings) {
            return true;
        });
    };
    SettingsService.prototype.initSettings = function () {
        var _this = this;
        if (this.settings == null) {
            return this.http.get(this.getApiUrl())
                .toPromise()
                .then(function (response) {
                _this.settings = response.json().data;
                return _this.settings;
            })
                .catch(function (error) { return _this.handleError(error); });
        }
        else {
            return Promise.resolve(this.settings);
        }
    };
    SettingsService.prototype.getSetting = function (name) {
        var _this = this;
        return this.initSettings()
            .then(function (settings) { return settings.find(function (setting) { return setting.name == name; }); })
            .catch(function (error) {
            _this.handleError(error);
        });
    };
    SettingsService.prototype.getSettingValue = function (name) {
        var _this = this;
        return this.getSetting(name)
            .then(function (setting) { return setting.value; })
            .catch(function (error) {
            console.error("Error while retrieving setting: " + name);
            _this.handleError(error);
        });
    };
    SettingsService.prototype.getSettingJSONValue = function (name) {
        var _this = this;
        return this.getSetting(name)
            .then(function (setting) { return JSON.parse(setting.value); })
            .catch(function (error) { return _this.handleError(error); });
    };
    SettingsService.prototype.getMenuEnableHome = function () {
        return this.getSettingValue('site.menu.enable.home');
    };
    SettingsService.prototype.getMenuEnableObjects = function () {
        return this.getSettingValue('site.menu.enable.objects');
    };
    SettingsService.prototype.getMenuEnableHoas = function () {
        return this.getSettingValue('site.menu.enable.hoas');
    };
    SettingsService.prototype.getMenuEnableParties = function () {
        return this.getSettingValue('site.menu.enable.parties');
    };
    SettingsService.prototype.getMenuEnablePartyAccount = function () {
        return this.getSettingValue('site.menu.enable.partyaccount');
    };
    SettingsService.prototype.getMenuEnableProjects = function () {
        return this.getSettingValue('site.menu.enable.projects');
    };
    SettingsService.prototype.getAutoSaveEnable = function () {
        return this.getSettingValue('site.autosave.enable');
    };
    SettingsService.prototype.getAutoSaveDebounceTimeMillis = function () {
        return this.getSettingValue('site.autosave.debouncetimemillis')
            .then(function (s) { return Number.parseInt(s); });
    };
    SettingsService.prototype.getPartyAccountEnableHeading2 = function () {
        return this.getSettingValue('partyaccount.enable.heading2');
    };
    SettingsService.prototype.getPartyAccountEnableHeading3 = function () {
        return this.getSettingValue('partyaccount.enable.heading3');
    };
    SettingsService.prototype.getPartyAccountEnableHeading4 = function () {
        return this.getSettingValue('partyaccount.enable.heading4');
    };
    SettingsService.prototype.getPartyAccountEnableHeading5 = function () {
        return this.getSettingValue('partyaccount.enable.heading5');
    };
    SettingsService.prototype.getPartyAccountEnableHeading6 = function () {
        return this.getSettingValue('partyaccount.enable.heading6');
    };
    SettingsService.prototype.getObjectDetailEnableHeading1 = function () {
        return this.getSettingValue('objectdetail.enable.heading1');
    };
    SettingsService.prototype.getObjectDetailEnableHeading1Goals = function () {
        return this.getSettingValue('objectdetail.enable.heading1.goals');
    };
    SettingsService.prototype.getObjectDetailEnableHeading2 = function () {
        return this.getSettingValue('objectdetail.enable.heading2');
    };
    SettingsService.prototype.getObjectDetailEnableHeading3 = function () {
        return this.getSettingValue('objectdetail.enable.heading3');
    };
    SettingsService.prototype.getObjectDetailEnableHeading4 = function () {
        return this.getSettingValue('objectdetail.enable.heading4');
    };
    SettingsService.prototype.getObjectDetailEnableHeading5 = function () {
        return this.getSettingValue('objectdetail.enable.heading5');
    };
    SettingsService.prototype.getObjectDetailEnableHeading6 = function () {
        return this.getSettingValue('objectdetail.enable.heading6');
    };
    SettingsService.prototype.getObjectDetailTagFilters = function () {
        return this.getSettingJSONValue('objectdetail.tagfilters');
    };
    SettingsService.prototype.getObjectDetailTagFiltersDefaultSelection = function () {
        return this.getSettingValue('objectdetail.tagfilters.defaultselection');
    };
    SettingsService.prototype.getObjectDetailTagFiltersOverruledSelection = function () {
        return this.getSettingJSONValue('objectdetail.tagfilters.overruledselection');
    };
    SettingsService.prototype.getObjectDetailShowTags = function () {
        return this.getSettingValue('objectdetail.showtags');
    };
    SettingsService.prototype.getHoaDetailEnableHeading1 = function () {
        return this.getSettingValue('hoadetail.enable.heading1');
    };
    SettingsService.prototype.getHoaDetailEnableHeading1Goals = function () {
        return this.getSettingValue('hoadetail.enable.heading1.goals');
    };
    SettingsService.prototype.getHoaDetailEnableHeading2 = function () {
        return this.getSettingValue('hoadetail.enable.heading2');
    };
    SettingsService.prototype.getHoaDetailEnableHeading3 = function () {
        return this.getSettingValue('hoadetail.enable.heading3');
    };
    SettingsService.prototype.getHoaDetailEnableHeading4 = function () {
        return this.getSettingValue('hoadetail.enable.heading4');
    };
    SettingsService.prototype.getHoaDetailEnableHeading5 = function () {
        return this.getSettingValue('hoadetail.enable.heading5');
    };
    SettingsService.prototype.getHoaDetailEnableHeading6 = function () {
        return this.getSettingValue('hoadetail.enable.heading6');
    };
    SettingsService.prototype.getHoaDetailTagFilters = function () {
        return this.getSettingJSONValue('hoadetail.tagfilters');
    };
    SettingsService.prototype.getHoaDetailTagFiltersDefaultSelection = function () {
        return this.getSettingValue('hoadetail.tagfilters.defaultselection');
    };
    SettingsService.prototype.getHoaDetailTagFiltersOverruledSelection = function () {
        return this.getSettingJSONValue('hoadetail.tagfilters.overruledselection');
    };
    SettingsService.prototype.getHoaDetailShowTags = function () {
        return this.getSettingValue('hoadetail.showtags');
    };
    SettingsService.prototype.getQuestionInstanceShowTreeReference = function () {
        return this.getSettingValue('questioninstance.showtreereference');
    };
    SettingsService.prototype.getEmailFromAdress = function () {
        return this.getSettingValue('email.fromaddress');
    };
    SettingsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, message_service_1.MessageService])
    ], SettingsService);
    return SettingsService;
}(bean_service_1.BeanService));
exports.SettingsService = SettingsService;
