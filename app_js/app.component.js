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
var AppComponent = /** @class */ (function () {
    function AppComponent(partyAccountService, contentService, settingsService, router, route) {
        this.partyAccountService = partyAccountService;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.router = router;
        this.route = route;
        this.enableHome = false;
        this.enableObjects = false;
        this.enableProjects = false;
        this.enableParties = false;
        this.enablePartyAccount = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.settingsService.getMenuEnableHome().then(function (s) { return _this.enableHome = (s == 'Y'); });
        this.settingsService.getMenuEnableObjects().then(function (s) { return _this.enableObjects = (s == 'Y'); });
        this.settingsService.getMenuEnableProjects().then(function (s) { return _this.enableProjects = (s == 'Y'); });
        this.settingsService.getMenuEnableParties().then(function (s) { return _this.enableParties = (s == 'Y'); });
        this.settingsService.getMenuEnablePartyAccount().then(function (s) { return _this.enablePartyAccount = (s == 'Y'); });
        // console.log(this.route);
        this.router.events.subscribe(function (evt) {
            if (!(evt instanceof router_1.NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    };
    AppComponent.prototype.onActivateRouterOutlet = function (component) {
        var homeComps = document.getElementsByTagName("home");
        var homePrerender = document.getElementById("homePrerender");
        if (component.isHomeComponent) {
            homePrerender.style.display = null;
        }
        else {
            homePrerender.style.display = "none";
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app_html/app.component.html'
        }),
        __metadata("design:paramtypes", [partyaccount_service_1.PartyAccountService, content_service_1.ContentService, settings_service_1.SettingsService, router_1.Router, router_1.ActivatedRoute])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
