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
var TemplateComponent = /** @class */ (function () {
    function TemplateComponent(router) {
        this.router = router;
    }
    TemplateComponent.prototype.ngOnInit = function () {
        this.field = "een veld...";
        this.aTemplateObject = {
            id: 1,
            name: "jajaja",
            anotherProperty: "property"
        };
    };
    TemplateComponent = __decorate([
        core_1.Component({
            selector: 'my-template',
            templateUrl: 'app_html/template.component.html',
            styleUrls: ['app_html/template.component.css']
        }),
        __metadata("design:paramtypes", [router_1.Router])
    ], TemplateComponent);
    return TemplateComponent;
}());
exports.TemplateComponent = TemplateComponent;
