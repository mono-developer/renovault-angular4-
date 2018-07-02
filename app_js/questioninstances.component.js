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
var questioninstance_component_1 = require("./questioninstance.component");
var wizard_service_1 = require("./wizard.service");
var autosave_service_1 = require("./autosave.service");
var QuestionInstancesComponent = /** @class */ (function () {
    function QuestionInstancesComponent(router, wizardService, autoSaveService) {
        this.router = router;
        this.wizardService = wizardService;
        this.autoSaveService = autoSaveService;
        this.read_only = false;
        this.onSaveClicked = new core_1.EventEmitter();
        this.questionInstancesForm = null;
    }
    QuestionInstancesComponent.prototype.ngOnInit = function () {
    };
    QuestionInstancesComponent.prototype.ngOnDestroy = function () {
        this.stopMonitoring();
    };
    QuestionInstancesComponent.prototype.save = function () {
        var _this = this;
        var arr = [];
        this.questionInstanceComponents.forEach(function (component) {
            arr.push(component.instance);
        });
        return this.wizardService.updateQuestionInstances(arr)
            .then(function (result) {
            _this.onSaveClicked.emit(_this.reference_string);
        });
    };
    // onChange() {
    // 	this.onQuestionInstanceChanged.emit(this.reference_string);
    // }
    QuestionInstancesComponent.prototype.ngAfterViewInit = function () {
        if (this.questionInstancesForm == null && this.questionInstancesForms.first) {
            this.questionInstancesForm = this.questionInstancesForms.first;
            this.startMonitoring();
        }
    };
    QuestionInstancesComponent.prototype.startMonitoring = function () {
        if (this.questionInstancesForm != null && !this.read_only) {
            this.autoSaveService.startMonitoring(this, this.questionInstancesForm);
        }
    };
    QuestionInstancesComponent.prototype.stopMonitoring = function () {
        this.autoSaveService.stopMonitoring();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], QuestionInstancesComponent.prototype, "reference_table", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], QuestionInstancesComponent.prototype, "reference_id", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], QuestionInstancesComponent.prototype, "reference_string", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], QuestionInstancesComponent.prototype, "read_only", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], QuestionInstancesComponent.prototype, "onSaveClicked", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], QuestionInstancesComponent.prototype, "wizardQuestions", void 0);
    __decorate([
        core_1.ViewChildren(questioninstance_component_1.QuestionInstanceComponent),
        __metadata("design:type", core_1.QueryList)
    ], QuestionInstancesComponent.prototype, "questionInstanceComponents", void 0);
    __decorate([
        core_1.ViewChildren("questionInstancesForm"),
        __metadata("design:type", core_1.QueryList)
    ], QuestionInstancesComponent.prototype, "questionInstancesForms", void 0);
    QuestionInstancesComponent = __decorate([
        core_1.Component({
            selector: 'questioninstances',
            templateUrl: 'app_html/questioninstances.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, wizard_service_1.WizardService, autosave_service_1.AutoSaveService])
    ], QuestionInstancesComponent);
    return QuestionInstancesComponent;
}());
exports.QuestionInstancesComponent = QuestionInstancesComponent;
