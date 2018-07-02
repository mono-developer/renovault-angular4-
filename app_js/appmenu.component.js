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
var router_1 = require("@angular/router");
var partyaccount_service_1 = require("./partyaccount.service");
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
var autosave_service_1 = require("./autosave.service");
var AppMenuComponent = /** @class */ (function () {
    function AppMenuComponent(partyAccountService, contentService, settingsService, router, autoSaveService) {
        this.partyAccountService = partyAccountService;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.router = router;
        this.autoSaveService = autoSaveService;
        this.enableHome = false;
        this.enableObjects = false;
        this.enableHoas = false;
        this.enableProjects = false;
        this.enableParties = false;
        this.enablePartyAccount = false;
    }
    AppMenuComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.settingsService.getMenuEnableHome().then(function (s) { return _this.enableHome = (s == 'Y'); });
        this.settingsService.getMenuEnableObjects().then(function (s) { return _this.enableObjects = (s == 'Y'); });
        this.settingsService.getMenuEnableHoas().then(function (s) { return _this.enableHoas = (s == 'Y'); });
        this.settingsService.getMenuEnableProjects().then(function (s) { return _this.enableProjects = (s == 'Y'); });
        this.settingsService.getMenuEnableParties().then(function (s) { return _this.enableParties = (s == 'Y'); });
        this.settingsService.getMenuEnablePartyAccount().then(function (s) { return _this.enablePartyAccount = (s == 'Y'); });
    };
    AppMenuComponent.prototype.onAutoSaveClick = function (event) {
        this.autoSaveService.logStuff();
        event.preventDefault();
    };
    AppMenuComponent = __decorate([
        core_1.Component({
            selector: 'app-menu',
            templateUrl: 'app_html/appmenu.component.html'
        }),
        __metadata("design:paramtypes", [partyaccount_service_1.PartyAccountService, content_service_1.ContentService, settings_service_1.SettingsService, router_1.Router, autosave_service_1.AutoSaveService])
    ], AppMenuComponent);
    return AppMenuComponent;
}());
exports.AppMenuComponent = AppMenuComponent;
