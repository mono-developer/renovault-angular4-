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
var settings_service_1 = require("./settings.service");
var AutoSaveService = /** @class */ (function () {
    function AutoSaveService(settingsService) {
        var _this = this;
        this.settingsService = settingsService;
        this.enabled = false;
        this.status = 'idle';
        this.debounceTime = 5000;
        // get setting site.autosave.debouncetimemillis
        this.settingsService.getAutoSaveDebounceTimeMillis().then(function (s) { return _this.debounceTime = s; });
        this.settingsService.getAutoSaveEnable().then(function (s) { return _this.enabled = (s == 'Y'); });
    }
    AutoSaveService.prototype.startMonitoring = function (component, form) {
        var _this = this;
        // console.log('autosaveService.startMonitoring()');
        this.stopMonitoring(false);
        if (this.enabled && component) {
            this.component = component;
            this.form = form;
            this.status = 'saved';
            this.component = component;
            this.formValueChangesSubscription = this.form.valueChanges
                .map(function () {
                _this.status = 'changespending';
            })
                .debounceTime(this.debounceTime)
                .subscribe(function () {
                _this.saveImmediately();
            });
        }
    };
    AutoSaveService.prototype.saveImmediately = function () {
        var _this = this;
        if (this.component == null) {
            this.status = 'idle';
        }
        else {
            if (!this.form.pristine) {
                this.status = 'saving';
                return this.component.save()
                    .then(function (b) {
                    // if (this.form && !this.form.invalid) {
                    _this.status = 'saved';
                    // } else {
                    // this.status = 'invalidchanges';
                    // }
                    return true;
                })
                    .catch(function (b) {
                    _this.status = 'errorwhilesaving';
                    return false;
                });
            }
            else {
                this.status = 'saved';
            }
        }
        return Promise.resolve(true);
    };
    AutoSaveService.prototype.stopMonitoring = function (logIt) {
        if (logIt === void 0) { logIt = true; }
        if (logIt) {
            // console.log('autosaveService.stopMonitoring()');
        }
        if (this.formValueChangesSubscription != null) {
            this.formValueChangesSubscription.unsubscribe();
            this.formValueChangesSubscription = null;
            this.form = null;
            this.component = null;
            this.status = 'idle';
        }
    };
    AutoSaveService.prototype.getForm = function () {
        return this.form;
    };
    AutoSaveService.prototype.logStuff = function () {
        // console.log('autoSaveService.logStuff()');
        console.log(this.component);
        console.log(this.form);
    };
    AutoSaveService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [settings_service_1.SettingsService])
    ], AutoSaveService);
    return AutoSaveService;
}());
exports.AutoSaveService = AutoSaveService;
