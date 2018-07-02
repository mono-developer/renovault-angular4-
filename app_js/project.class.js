"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProjectPhase = /** @class */ (function () {
    function ProjectPhase() {
        this.general = false;
        this.preparation = false;
        this.execution = false;
        this.handover = false;
    }
    return ProjectPhase;
}());
exports.ProjectPhase = ProjectPhase;
var Project = /** @class */ (function () {
    function Project() {
        this.phase = new ProjectPhase();
    }
    return Project;
}());
exports.Project = Project;
