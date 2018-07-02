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
var objectbean_class_1 = require("./objectbean.class");
var object_service_1 = require("./object.service");
var content_service_1 = require("./content.service");
var ObjectComponent = /** @class */ (function () {
    function ObjectComponent(router, objectService, contentService) {
        this.router = router;
        this.objectService = objectService;
        this.contentService = contentService;
        this.onDeleteClicked = new core_1.EventEmitter();
        this.isSelected = false;
    }
    ObjectComponent.prototype.ngOnInit = function () {
        this.isSelected = this.objectService.isObjectSelected(this.object);
    };
    ObjectComponent.prototype.goToDetails = function () {
        var link = ['/objects', this.object.id];
        this.router.navigate(link);
    };
    ObjectComponent.prototype.toggleSelected = function () {
        this.objectService.toggleObjectSelection(this.object);
        this.isSelected = this.objectService.isObjectSelected(this.object);
    };
    ObjectComponent.prototype.delete = function (object) {
        this.onDeleteClicked.emit(null);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", objectbean_class_1.ObjectBean)
    ], ObjectComponent.prototype, "object", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ObjectComponent.prototype, "look", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ObjectComponent.prototype, "onDeleteClicked", void 0);
    ObjectComponent = __decorate([
        core_1.Component({
            selector: 'object',
            templateUrl: 'app_html/object.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, object_service_1.ObjectService, content_service_1.ContentService])
    ], ObjectComponent);
    return ObjectComponent;
}());
exports.ObjectComponent = ObjectComponent;
