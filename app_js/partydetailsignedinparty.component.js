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
var partyaccount_service_1 = require("./partyaccount.service");
var breadcrumbs_service_1 = require("./breadcrumbs.service");
var content_service_1 = require("./content.service");
var partydetail_component_1 = require("./partydetail.component");
var PartyDetailSignedInPartyComponent = /** @class */ (function () {
    function PartyDetailSignedInPartyComponent(partyAccountService, contentService, breadcrumbsService) {
        this.partyAccountService = partyAccountService;
        this.contentService = contentService;
        this.breadcrumbsService = breadcrumbsService;
    }
    PartyDetailSignedInPartyComponent.prototype.ngOnInit = function () {
        var _this = this;
        // console.log('ngOnInit');
        this.contentService.getContentItem('app.menu.partyaccount.partiessignedinparty')
            .then(function (s) {
            _this.breadcrumbsService.reset();
            _this.breadcrumbsService.pushCrumb(s, null);
        });
        this.partyAccountService.getSignedInParty()
            .then(function (p) { return _this.party = p; });
    };
    PartyDetailSignedInPartyComponent.prototype.onSave = function (p) {
        this.party = p;
        this.partyAccountService.signedInParty = this.party;
    };
    __decorate([
        core_1.ViewChild("partyDetailComponent"),
        __metadata("design:type", partydetail_component_1.PartyDetailComponent)
    ], PartyDetailSignedInPartyComponent.prototype, "partyDetailComponent", void 0);
    PartyDetailSignedInPartyComponent = __decorate([
        core_1.Component({
            selector: 'partydetailsignedinparty',
            templateUrl: 'app_html/partydetailsignedinparty.component.html'
        }),
        __metadata("design:paramtypes", [partyaccount_service_1.PartyAccountService, content_service_1.ContentService, breadcrumbs_service_1.BreadcrumbsService])
    ], PartyDetailSignedInPartyComponent);
    return PartyDetailSignedInPartyComponent;
}());
exports.PartyDetailSignedInPartyComponent = PartyDetailSignedInPartyComponent;
