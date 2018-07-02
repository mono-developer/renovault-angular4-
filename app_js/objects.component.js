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
var object_service_1 = require("./object.service");
var partyaccount_service_1 = require("./partyaccount.service");
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
var breadcrumbs_service_1 = require("./breadcrumbs.service");
var share_component_1 = require("./share.component");
var ObjectsComponent = /** @class */ (function () {
    function ObjectsComponent(router, objectService, partyAccountService, contentService, settingsService, breadcrumbsService) {
        this.router = router;
        this.objectService = objectService;
        this.partyAccountService = partyAccountService;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.breadcrumbsService = breadcrumbsService;
        this.enabled = false;
    }
    ObjectsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.settingsService.getMenuEnableObjects().then(function (s) { return _this.enabled = (s == 'Y'); });
        this.forceUpdate();
        this.contentService.getContentItem('app.menu.objects')
            .then(function (s) {
            _this.breadcrumbsService.reset();
            _this.breadcrumbsService.pushCrumb(s, '/objects');
        });
    };
    ObjectsComponent.prototype.addNewObject = function () {
        var _this = this;
        this.objectService.addNewObject()
            .then(function () {
            _this.forceUpdate();
        });
    };
    ObjectsComponent.prototype.delete = function (event, o) {
        var _this = this;
        this.objectService.deleteObject(o)
            .then(function () {
            _this.forceUpdate();
        });
        event.stopPropagation();
    };
    ObjectsComponent.prototype.share = function (event, o) {
        this.shareComponent.show(o);
        event.stopPropagation();
    };
    ObjectsComponent.prototype.goToDetails = function (o) {
        var link = ['/objects', o.id];
        this.router.navigate(link);
    };
    ObjectsComponent.prototype.forceUpdate = function () {
        var _this = this;
        this.objects = new Array();
        this.selectedObjects = new Array();
        this.objectService.getObjects().then(function (objects) {
            _this.objects = objects;
            _this.objects = objects.sort(function (a, b) {
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
            // this.partyAccountService.getSignedInPartyAccount().then(party => {
            //   if (party.multipleobjects == false) {
            //     let link = ['/objects', this.objects[0].id];
            //     this.router.navigate(link);
            //   }
            // });
        });
        this.objectService.getSelectedObjects().then(function (objects) { return _this.selectedObjects = objects; });
    };
    ObjectsComponent.prototype.getObjectAddress = function (o) {
        if (this.objectHasAddress(o)) {
            return o.getAddressDescription();
        }
        return '(voer adresgegevens in)';
    };
    ObjectsComponent.prototype.objectHasAddress = function (o) {
        return o != null && o.hasAddress();
    };
    ObjectsComponent.prototype.allowNewObject = function () {
        var _this = this;
        var allow = true;
        if (this.objects) {
            this.objects.forEach(function (o) {
                if (!_this.objectHasAddress(o)) {
                    allow = false;
                }
            });
        }
        return allow;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ObjectsComponent.prototype, "look", void 0);
    __decorate([
        core_1.ViewChild(share_component_1.ShareComponent),
        __metadata("design:type", share_component_1.ShareComponent)
    ], ObjectsComponent.prototype, "shareComponent", void 0);
    ObjectsComponent = __decorate([
        core_1.Component({
            selector: 'objects',
            templateUrl: 'app_html/objects.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, object_service_1.ObjectService, partyaccount_service_1.PartyAccountService, content_service_1.ContentService, settings_service_1.SettingsService, breadcrumbs_service_1.BreadcrumbsService])
    ], ObjectsComponent);
    return ObjectsComponent;
}());
exports.ObjectsComponent = ObjectsComponent;
