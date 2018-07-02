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
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
var ProjectDetailComponent = /** @class */ (function () {
    function ProjectDetailComponent(router, projectService, route, contentService, settingsService) {
        this.router = router;
        this.projectService = projectService;
        this.route = route;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.enabled = false;
    }
    ProjectDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.settingsService.getMenuEnableProjects().then(function (s) { return _this.enabled = (s == 'Y'); });
        this.route.params.forEach(function (params) {
            var id = +params['id'];
            _this.projectService.getProject(id).then(function (project) {
                _this.project = project;
                if (!_this.project.phase.general) {
                    _this.selectedTab = 1;
                }
                else if (!_this.project.phase.preparation) {
                    _this.selectedTab = 2;
                }
                else if (!_this.project.phase.execution) {
                    _this.selectedTab = 3;
                }
                else if (!_this.project.phase.handover) {
                    _this.selectedTab = 4;
                }
                else {
                    _this.selectedTab = 5;
                }
            });
        });
    };
    ProjectDetailComponent.prototype.save = function () {
        var _this = this;
        this.projectService.updateProject(this.project)
            .then(function (project) { return _this.project = project; });
    };
    ProjectDetailComponent = __decorate([
        core_1.Component({
            selector: 'projectdetail',
            templateUrl: 'app_html/projectdetail.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, project_service_1.ProjectService, router_1.ActivatedRoute, content_service_1.ContentService, settings_service_1.SettingsService])
    ], ProjectDetailComponent);
    return ProjectDetailComponent;
}());
exports.ProjectDetailComponent = ProjectDetailComponent;
