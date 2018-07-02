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
var project_service_1 = require("./project.service");
var wizard_component_1 = require("./wizard.component");
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
var ProjectsComponent = /** @class */ (function () {
    function ProjectsComponent(router, projectService, contentService, settingsService) {
        this.router = router;
        this.projectService = projectService;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.enabled = false;
    }
    ProjectsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.settingsService.getMenuEnableProjects().then(function (s) { return _this.enabled = (s == 'Y'); });
        this.forceUpdate();
    };
    ProjectsComponent.prototype.addNewProject = function () {
        this.wizardComponent.show();
    };
    ProjectsComponent.prototype.delete = function (o) {
        var _this = this;
        this.projectService.deleteProject(o)
            .then(function () {
            _this.forceUpdate();
        });
    };
    ProjectsComponent.prototype.forceUpdate = function () {
        var _this = this;
        this.projects = new Array();
        this.projectService.getProjects().then(function (projects) { return _this.projects = projects; });
    };
    ProjectsComponent.prototype.wizardDone = function () {
        var _this = this;
        this.projectService.addNewProject().then(function (project) {
            var link = ['/projects/' + project.id];
            _this.router.navigate(link);
        });
    };
    __decorate([
        core_1.ViewChild(wizard_component_1.WizardComponent),
        __metadata("design:type", wizard_component_1.WizardComponent)
    ], ProjectsComponent.prototype, "wizardComponent", void 0);
    ProjectsComponent = __decorate([
        core_1.Component({
            templateUrl: 'app_html/projects.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, project_service_1.ProjectService, content_service_1.ContentService, settings_service_1.SettingsService])
    ], ProjectsComponent);
    return ProjectsComponent;
}());
exports.ProjectsComponent = ProjectsComponent;
