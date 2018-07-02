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
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(router, route, contentService, settingsService) {
        this.router = router;
        this.route = route;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.isHomeComponent = true;
        this.enabled = false;
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        // console.log('init home');
        this.homePrerender = document.getElementById("homePrerender");
        this.homePrerender.style.display = null;
        // this.settingsService.getMenuEnableHome().then(s => this.enabled = (s == 'Y'));
        this.route.params.forEach(function (params) {
            var pId = +params['id'];
            _this.id = pId;
        });
        // console.log(this.route);
    };
    HomeComponent.prototype.ngOnDestroy = function () {
        // console.log('destroy home');
        this.homePrerender.style.display = 'none';
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'home',
            templateUrl: '/api/contentitem/value/home.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, content_service_1.ContentService, settings_service_1.SettingsService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
