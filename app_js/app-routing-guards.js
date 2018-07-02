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
var object_service_1 = require("./object.service");
var hoa_service_1 = require("./hoa.service");
var breadcrumbs_service_1 = require("./breadcrumbs.service");
var autosave_service_1 = require("./autosave.service");
var message_service_1 = require("./message.service");
var NoPartyAccountGuard = /** @class */ (function () {
    function NoPartyAccountGuard(router, partyAccountService, breadcrumbsService) {
        this.router = router;
        this.partyAccountService = partyAccountService;
        this.breadcrumbsService = breadcrumbsService;
    }
    NoPartyAccountGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return this.partyAccountService.getPartyAccountIsSignedIn()
            .then(function (partyIsSignedIn) {
            // console.log('NoPartyAccountGuard');
            // console.log(state.url);
            if (!partyIsSignedIn) {
                // console.log('no party signed in');
                _this.breadcrumbsService.reset();
                _this.partyAccountService.redirectUrl = state.url;
                // console.log('redirecting to login page');
                _this.router.navigate(['/partyaccountlogin']);
                return false;
            }
            return true;
        });
    };
    NoPartyAccountGuard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router, partyaccount_service_1.PartyAccountService, breadcrumbs_service_1.BreadcrumbsService])
    ], NoPartyAccountGuard);
    return NoPartyAccountGuard;
}());
exports.NoPartyAccountGuard = NoPartyAccountGuard;
var PartyAccountGuard = /** @class */ (function () {
    function PartyAccountGuard(router, partyAccountService) {
        this.router = router;
        this.partyAccountService = partyAccountService;
    }
    PartyAccountGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return this.partyAccountService.getPartyAccountIsSignedIn()
            .then(function (partyIsSignedIn) {
            // console.log('PartyAccountGuard');
            // console.log(state.url);
            if (partyIsSignedIn) {
                // console.log('a party is signed in, redirecting to objects');
                _this.router.navigate(['/objects']);
                return false;
            }
            return true;
        });
    };
    PartyAccountGuard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router, partyaccount_service_1.PartyAccountService])
    ], PartyAccountGuard);
    return PartyAccountGuard;
}());
exports.PartyAccountGuard = PartyAccountGuard;
var SettingsGuard = /** @class */ (function () {
    function SettingsGuard(partyAccountService) {
        this.partyAccountService = partyAccountService;
    }
    SettingsGuard.prototype.canActivate = function (route, state) {
        // check settings here
        return true;
    };
    SettingsGuard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [partyaccount_service_1.PartyAccountService])
    ], SettingsGuard);
    return SettingsGuard;
}());
exports.SettingsGuard = SettingsGuard;
var ObjectGuard = /** @class */ (function () {
    function ObjectGuard(router, partyAccountService, objectService) {
        this.router = router;
        this.partyAccountService = partyAccountService;
        this.objectService = objectService;
    }
    ObjectGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return this.partyAccountService.getSignedInPartyAccount()
            .then(function (party) {
            if (party != null) {
                if (party.multipleobjects == false) {
                    return _this.objectService.getObjects()
                        .then(function (objects) {
                        var link = ['/objects', objects[0].id, { selectedHeading: "heading1" }];
                        _this.router.navigate(link);
                        return false;
                    });
                }
                else {
                    var id = route.params['id'];
                    var selectedHeading = route.params['selectedHeading'];
                    if (id && !selectedHeading) {
                        var link = ['/objects', id, { selectedHeading: "heading1" }];
                        _this.router.navigate(link);
                        return false;
                    }
                }
            }
            return true;
        });
    };
    ObjectGuard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router, partyaccount_service_1.PartyAccountService, object_service_1.ObjectService])
    ], ObjectGuard);
    return ObjectGuard;
}());
exports.ObjectGuard = ObjectGuard;
var HoaGuard = /** @class */ (function () {
    function HoaGuard(router, partyAccountService, hoaService) {
        this.router = router;
        this.partyAccountService = partyAccountService;
        this.hoaService = hoaService;
    }
    HoaGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return this.partyAccountService.getSignedInPartyAccount()
            .then(function (party) {
            if (party != null) {
                if (party.multipleobjects == false) {
                    return _this.hoaService.getHoas()
                        .then(function (hoas) {
                        var link = ['/hoas', hoas[0].id, { selectedHeading: "heading1" }];
                        _this.router.navigate(link);
                        return false;
                    });
                }
                else {
                    var id = route.params['id'];
                    var selectedHeading = route.params['selectedHeading'];
                    if (id && !selectedHeading) {
                        var link = ['/hoas', id, { selectedHeading: "heading1" }];
                        _this.router.navigate(link);
                        return false;
                    }
                }
            }
            return true;
        });
    };
    HoaGuard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router, partyaccount_service_1.PartyAccountService, hoa_service_1.HoaService])
    ], HoaGuard);
    return HoaGuard;
}());
exports.HoaGuard = HoaGuard;
var AutoSaveStopMonitoringGuard = /** @class */ (function () {
    function AutoSaveStopMonitoringGuard(autoSaveService, messageService) {
        this.autoSaveService = autoSaveService;
        this.messageService = messageService;
    }
    AutoSaveStopMonitoringGuard.prototype.canDeactivate = function (component, route, state) {
        this.autoSaveService.saveImmediately()
            .then(function () {
            // this.autoSaveService.stopMonitoring();
        });
        return true;
    };
    AutoSaveStopMonitoringGuard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [autosave_service_1.AutoSaveService, message_service_1.MessageService])
    ], AutoSaveStopMonitoringGuard);
    return AutoSaveStopMonitoringGuard;
}());
exports.AutoSaveStopMonitoringGuard = AutoSaveStopMonitoringGuard;
