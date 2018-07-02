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
var security_service_1 = require("./security.service");
var message_service_1 = require("./message.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var typeahead_component_1 = require("./typeahead.component");
var security_class_1 = require("./security.class");
var ShareComponent = /** @class */ (function () {
    function ShareComponent(router, contentService, settingsService, securityService, messageService) {
        this.router = router;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.securityService = securityService;
        this.messageService = messageService;
        this.enabled = true;
        this.securityRecords = null;
        this.ownSecurityRecord = null;
        this.selectedSecurityRecord = null;
    }
    ShareComponent.prototype.ngOnInit = function () {
        // this.forceUpdate();
    };
    ShareComponent.prototype.show = function (o) {
        var _this = this;
        this.bean = o;
        if (this.bean != null) {
            this.securityService.getSecurityForTable(this.bean.getTable(), this.bean.getId())
                .then(function (s) {
                var ownSecurityRecords;
                _this.securityRecords = s.filter(function (s) { return s.granteerole != 'owner'; });
                ownSecurityRecords = s.filter(function (s) { return s.granteerole == 'owner'; });
                if (ownSecurityRecords.length == 1) {
                    _this.ownSecurityRecord = ownSecurityRecords[0];
                }
            });
        }
        if (this.typeaheadComponent) {
            this.typeaheadComponent.reset();
        }
        this.modal.show();
    };
    ShareComponent.prototype.hide = function () {
        this.modal.hide();
    };
    ShareComponent.prototype.selected = function (s) {
        // console.log(s);
    };
    ShareComponent.prototype.add = function (selectedParty) {
        var _this = this;
        var s = new security_class_1.Security();
        s.granteelogin = selectedParty.email;
        s.granteerole = 'read';
        s.referencetable = this.bean.getTable();
        s.referenceid = this.bean.getId();
        this.securityService.addNewSecurity(s)
            .then(function (s) {
            if (s != null) {
                _this.securityRecords.push(s);
                if (_this.typeaheadComponent) {
                    _this.typeaheadComponent.reset();
                }
            }
            else {
                _this.hide();
            }
        });
    };
    ShareComponent.prototype.findInSecurityRecords = function (email) {
        var securityRecord = this.securityRecords.find(function (s) { return s.granteelogin == email; });
        return securityRecord;
    };
    ShareComponent.prototype.delete = function (event, o) {
        var _this = this;
        this.securityService.deleteSecurity(o)
            .then(function (s) {
            if (s != null) {
                _this.securityRecords = _this.securityRecords.filter(function (r) { return r != o; });
            }
            else {
                _this.hide();
            }
        });
        event.stopPropagation();
    };
    ShareComponent.prototype.toggleSelect = function (event, o) {
        if (this.selectedSecurityRecord == o.id) {
            this.selectedSecurityRecord = null;
        }
        else {
            this.selectedSecurityRecord = o.id;
        }
        // this.securityService.deleteSecurity(o)
        //     .then(s => {
        //         if (s != null) {
        //             this.securityRecords = this.securityRecords.filter(r => r != o);
        //         }
        //         else {
        //             this.hide();
        //         }
        //     })
        //     ;
        event.stopPropagation();
    };
    ShareComponent.prototype.transfer = function (event, to) {
        var _this = this;
        this.securityService.transferSecurity(this.ownSecurityRecord, to)
            .then(function (s) {
            _this.hide();
            _this.messageService.sendMessage("Overdracht aan " + to.granteelogin + " voltooid.", "");
            _this.bean.setGranteerole(to.granteerole);
        });
        event.stopPropagation();
    };
    ShareComponent.prototype.securityClick = function (event) {
        event.stopPropagation();
    };
    __decorate([
        core_1.ViewChild(ngx_bootstrap_1.ModalDirective),
        __metadata("design:type", ngx_bootstrap_1.ModalDirective)
    ], ShareComponent.prototype, "modal", void 0);
    __decorate([
        core_1.ViewChild(typeahead_component_1.TypeaheadComponent),
        __metadata("design:type", typeahead_component_1.TypeaheadComponent)
    ], ShareComponent.prototype, "typeaheadComponent", void 0);
    ShareComponent = __decorate([
        core_1.Component({
            selector: 'share',
            templateUrl: 'app_html/share.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, content_service_1.ContentService, settings_service_1.SettingsService, security_service_1.SecurityService, message_service_1.MessageService])
    ], ShareComponent);
    return ShareComponent;
}());
exports.ShareComponent = ShareComponent;
