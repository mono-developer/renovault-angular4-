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
var message_service_1 = require("./message.service");
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
var breadcrumbs_service_1 = require("./breadcrumbs.service");
var PartyAccountComponent = /** @class */ (function () {
    function PartyAccountComponent(router, route, partyAccountService, messageService, contentService, settingsService, breadcrumbsService) {
        this.router = router;
        this.route = route;
        this.partyAccountService = partyAccountService;
        this.messageService = messageService;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.breadcrumbsService = breadcrumbsService;
        this.enabled = false;
        this.languageOptions = [
            { value: 'nl', display: 'Nederlands' },
            { value: 'en', display: 'English' },
        ];
    }
    PartyAccountComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.settingsService.getMenuEnablePartyAccount().then(function (s) { return _this.enabled = (s == 'Y'); });
        this.contentService.getContentItem('app.menu.partyaccount.partyaccount')
            .then(function (s) {
            _this.breadcrumbsService.reset();
            _this.breadcrumbsService.pushCrumb(s, null);
        });
    };
    PartyAccountComponent.prototype.save = function () {
        this.partyAccountService.updatePartyAccount(this.partyAccountService.signedInPartyAccount);
    };
    PartyAccountComponent.prototype.changePassword = function () {
        var _this = this;
        this.partyAccountService.changePassword(this.password, this.newpassword1)
            .then(function (p) {
            _this.password = "";
            _this.newpassword1 = "";
            _this.newpassword2 = "";
            _this.messageService.sendMessage("Uw wachtwoord is gewijzigd.", "");
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], PartyAccountComponent.prototype, "look", void 0);
    PartyAccountComponent = __decorate([
        core_1.Component({
            templateUrl: 'app_html/partyaccount.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, partyaccount_service_1.PartyAccountService, message_service_1.MessageService, content_service_1.ContentService, settings_service_1.SettingsService, breadcrumbs_service_1.BreadcrumbsService])
    ], PartyAccountComponent);
    return PartyAccountComponent;
}());
exports.PartyAccountComponent = PartyAccountComponent;
