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
var project_class_1 = require("./project.class");
var project_service_1 = require("./project.service");
var content_service_1 = require("./content.service");
var ProjectComponent = /** @class */ (function () {
    function ProjectComponent(router, projectService, contentService) {
        this.router = router;
        this.projectService = projectService;
        this.contentService = contentService;
        this.onDeleteClicked = new core_1.EventEmitter();
    }
    ProjectComponent.prototype.goToDetails = function () {
        var link = ['/projects', this.project.id];
        this.router.navigate(link);
    };
    ProjectComponent.prototype.delete = function (project) {
        this.onDeleteClicked.emit(null);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", project_class_1.Project)
    ], ProjectComponent.prototype, "project", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ProjectComponent.prototype, "onDeleteClicked", void 0);
    ProjectComponent = __decorate([
        core_1.Component({
            selector: 'my-project',
            templateUrl: 'app_html/project.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, project_service_1.ProjectService, content_service_1.ContentService])
    ], ProjectComponent);
    return ProjectComponent;
}());
exports.ProjectComponent = ProjectComponent;
