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
var party_class_1 = require("./party.class");
var party_service_1 = require("./party.service");
var content_service_1 = require("./content.service");
var PartyComponent = /** @class */ (function () {
    function PartyComponent(router, partyService, contentService) {
        this.router = router;
        this.partyService = partyService;
        this.contentService = contentService;
        this.onDeleteClicked = new core_1.EventEmitter();
    }
    PartyComponent.prototype.ngOnInit = function () {
    };
    PartyComponent.prototype.goToDetails = function () {
        var link = ['/parties', this.party.id];
        this.router.navigate(link);
    };
    PartyComponent.prototype.delete = function (object) {
        this.onDeleteClicked.emit(null);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", party_class_1.Party)
    ], PartyComponent.prototype, "party", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], PartyComponent.prototype, "onDeleteClicked", void 0);
    PartyComponent = __decorate([
        core_1.Component({
            selector: 'party',
            templateUrl: 'app_html/party.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, party_service_1.PartyService, content_service_1.ContentService])
    ], PartyComponent);
    return PartyComponent;
}());
exports.PartyComponent = PartyComponent;
