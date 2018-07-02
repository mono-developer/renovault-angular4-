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
var hoa_service_1 = require("./hoa.service");
var partyaccount_service_1 = require("./partyaccount.service");
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
var breadcrumbs_service_1 = require("./breadcrumbs.service");
var share_component_1 = require("./share.component");
var HoasComponent = /** @class */ (function () {
    function HoasComponent(router, hoaService, partyAccountService, contentService, settingsService, breadcrumbsService) {
        this.router = router;
        this.hoaService = hoaService;
        this.partyAccountService = partyAccountService;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.breadcrumbsService = breadcrumbsService;
        this.enabled = false;
    }
    HoasComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.settingsService.getMenuEnableHoas().then(function (s) { return _this.enabled = (s == 'Y'); });
        this.forceUpdate();
        this.contentService.getContentItem('app.menu.hoas')
            .then(function (s) {
            _this.breadcrumbsService.reset();
            _this.breadcrumbsService.pushCrumb(s, '/hoas');
        });
    };
    HoasComponent.prototype.addNewHoa = function () {
        var _this = this;
        this.hoaService.addNewHoa()
            .then(function () {
            _this.forceUpdate();
        });
    };
    HoasComponent.prototype.delete = function (event, o) {
        var _this = this;
        this.hoaService.deleteHoa(o)
            .then(function () {
            _this.forceUpdate();
        });
        event.stopPropagation();
    };
    HoasComponent.prototype.share = function (event, o) {
        // console.log('hoas.component.ts: sharecomponent should show now...');
        this.shareComponent.show(o);
        event.stopPropagation();
    };
    HoasComponent.prototype.goToDetails = function (o) {
        var link = ['/hoas', o.id];
        this.router.navigate(link);
    };
    HoasComponent.prototype.forceUpdate = function () {
        var _this = this;
        this.hoas = new Array();
        this.selectedHoas = new Array();
        this.hoaService.getHoas().then(function (hoas) {
            _this.hoas = hoas.sort(function (a, b) {
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
        this.hoaService.getSelectedHoas().then(function (hoas) { return _this.selectedHoas = hoas; });
    };
    HoasComponent.prototype.getHoaAddress = function (o) {
        if (this.hoaHasAddress(o)) {
            return o.getAddressDescription();
        }
        return '(voer adresgegevens in)';
    };
    HoasComponent.prototype.hoaHasAddress = function (o) {
        return o != null && o.hasAddress();
    };
    HoasComponent.prototype.allowNewHoa = function () {
        var _this = this;
        var allow = true;
        if (this.hoas) {
            this.hoas.forEach(function (o) {
                if (!_this.hoaHasAddress(o)) {
                    allow = false;
                }
            });
        }
        return allow;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], HoasComponent.prototype, "look", void 0);
    __decorate([
        core_1.ViewChild(share_component_1.ShareComponent),
        __metadata("design:type", share_component_1.ShareComponent)
    ], HoasComponent.prototype, "shareComponent", void 0);
    HoasComponent = __decorate([
        core_1.Component({
            selector: 'hoas',
            templateUrl: 'app_html/hoas.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, hoa_service_1.HoaService, partyaccount_service_1.PartyAccountService, content_service_1.ContentService, settings_service_1.SettingsService, breadcrumbs_service_1.BreadcrumbsService])
    ], HoasComponent);
    return HoasComponent;
}());
exports.HoasComponent = HoasComponent;
