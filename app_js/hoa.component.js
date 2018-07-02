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
var hoa_class_1 = require("./hoa.class");
var hoa_service_1 = require("./hoa.service");
var content_service_1 = require("./content.service");
var HoaComponent = /** @class */ (function () {
    function HoaComponent(router, hoaService, contentService) {
        this.router = router;
        this.hoaService = hoaService;
        this.contentService = contentService;
        this.onDeleteClicked = new core_1.EventEmitter();
        this.isSelected = false;
    }
    HoaComponent.prototype.ngOnInit = function () {
        this.isSelected = this.hoaService.isHoaSelected(this.hoa);
    };
    HoaComponent.prototype.goToDetails = function () {
        var link = ['/hoa', this.hoa.id];
        this.router.navigate(link);
    };
    HoaComponent.prototype.toggleSelected = function () {
        this.hoaService.toggleHoaSelection(this.hoa);
        this.isSelected = this.hoaService.isHoaSelected(this.hoa);
    };
    HoaComponent.prototype.delete = function (hoa) {
        this.onDeleteClicked.emit(null);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", hoa_class_1.Hoa)
    ], HoaComponent.prototype, "hoa", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], HoaComponent.prototype, "look", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], HoaComponent.prototype, "onDeleteClicked", void 0);
    HoaComponent = __decorate([
        core_1.Component({
            selector: 'hoa',
            templateUrl: 'app_html/hoa.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, hoa_service_1.HoaService, content_service_1.ContentService])
    ], HoaComponent);
    return HoaComponent;
}());
exports.HoaComponent = HoaComponent;
