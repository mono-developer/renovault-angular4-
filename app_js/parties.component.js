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
var party_service_1 = require("./party.service");
var partyaccount_service_1 = require("./partyaccount.service");
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
var breadcrumbs_service_1 = require("./breadcrumbs.service");
var PartiesComponent = /** @class */ (function () {
    function PartiesComponent(router, partyService, partyAccountService, contentService, settingsService, breadcrumbsService) {
        this.router = router;
        this.partyService = partyService;
        this.partyAccountService = partyAccountService;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.breadcrumbsService = breadcrumbsService;
        this.enabled = false;
    }
    PartiesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.settingsService.getMenuEnableParties().then(function (s) { return _this.enabled = (s == 'Y'); });
        this.forceUpdate();
        this.contentService.getContentItem('app.menu.parties')
            .then(function (s) {
            _this.breadcrumbsService.reset();
            _this.breadcrumbsService.pushCrumb(s, '/parties');
        });
    };
    PartiesComponent.prototype.add = function () {
        var _this = this;
        this.partyService.addNewParty()
            .then(function (p) {
            _this.forceUpdate();
            var link = ['/parties', p.id];
            _this.router.navigate(link);
        });
    };
    PartiesComponent.prototype.delete = function (event, p) {
        var _this = this;
        this.partyService.deleteParty(p)
            .then(function () {
            _this.forceUpdate();
        });
        event.stopPropagation();
    };
    PartiesComponent.prototype.forceUpdate = function () {
        var _this = this;
        this.parties = new Array();
        this.partyService.getParties().then(function (parties) {
            _this.parties = parties.sort(function (a, b) {
                var toReturn = 0;
                var name_a = a.getDisplayString().toLowerCase();
                var name_b = b.getDisplayString().toLowerCase();
                if (name_a > name_b) {
                    toReturn = 1;
                }
                else if (name_b > name_a) {
                    toReturn = -1;
                }
                // console.log('comparing: ' + name_a + ' to ' + name_b + ' => ' + toReturn);
                return toReturn;
            });
        });
    };
    PartiesComponent.prototype.goToDetails = function (p) {
        var link = ['/parties', p.id];
        this.router.navigate(link);
    };
    PartiesComponent = __decorate([
        core_1.Component({
            selector: 'parties',
            templateUrl: 'app_html/parties.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, party_service_1.PartyService, partyaccount_service_1.PartyAccountService, content_service_1.ContentService, settings_service_1.SettingsService, breadcrumbs_service_1.BreadcrumbsService])
    ], PartiesComponent);
    return PartiesComponent;
}());
exports.PartiesComponent = PartiesComponent;
