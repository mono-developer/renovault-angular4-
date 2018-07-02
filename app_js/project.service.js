"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var http_1 = require("@angular/http");
var project_class_1 = require("./project.class");
var bean_service_1 = require("./bean.service");
var message_service_1 = require("./message.service");
var ProjectService = /** @class */ (function (_super) {
    __extends(ProjectService, _super);
    function ProjectService(http, messageService) {
        var _this = _super.call(this, http, messageService) || this;
        _this.http = http;
        _this.messageService = messageService;
        _this.apiName = 'project';
        return _this;
    }
    ProjectService.prototype.getApiName = function () {
        return this.apiName;
    };
    ProjectService.prototype.getProjects = function () {
        return this.getBeans();
    };
    ProjectService.prototype.getProject = function (id) {
        return this.getBean(id);
    };
    ProjectService.prototype.deleteProject = function (projectToDelete) {
        return this.deleteBean(projectToDelete).then(function (project) {
            // this.objects = this.objects.filter(o => o.id !== projectToDelete.id);
            // this.selectedObjects = this.selectedObjects.filter(o => o.id !== projectToDelete.id);
            return project;
        });
    };
    ProjectService.prototype.updateProject = function (project) {
        return this.updateBean(project);
    };
    ProjectService.prototype.addNewProject = function () {
        var _this = this;
        var p = new project_class_1.Project();
        return this.http
            .post(this.getApiUrl() + '/createNewFromSession', JSON.stringify(p), { headers: this.headers })
            .toPromise()
            .then(function (response) {
            return response.json().data;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    ProjectService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, message_service_1.MessageService])
    ], ProjectService);
    return ProjectService;
}(bean_service_1.BeanService));
exports.ProjectService = ProjectService;
