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
var forms_1 = require("@angular/forms");
var wizardquestion_class_1 = require("./wizardquestion.class");
var questioninstance_class_1 = require("./questioninstance.class");
var wizard_service_1 = require("./wizard.service");
var settings_service_1 = require("./settings.service");
var QuestionInstanceComponent = /** @class */ (function () {
    function QuestionInstanceComponent(router, wizardService, settingsService) {
        this.router = router;
        this.wizardService = wizardService;
        this.settingsService = settingsService;
        this.showTreeReference = false;
    }
    QuestionInstanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.settingsService.getQuestionInstanceShowTreeReference().then(function (s) { return _this.showTreeReference = (s == 'Y'); });
        this.wizardService.getQuestion(this.wizardQuestion.question)
            .then(function (question) {
            _this.question = question;
            _this.wizardService.getQuestionInstance(_this.reference_table, _this.reference_id, _this.reference_string, _this.question.id)
                .then(function (instance) {
                if (instance != null) {
                    _this.instance = instance;
                }
                else {
                    _this.instance = new questioninstance_class_1.QuestionInstance();
                    _this.instance.reference_table = _this.reference_table;
                    _this.instance.reference_id = _this.reference_id;
                    _this.instance.reference_string = _this.reference_string;
                    _this.instance.question_id = _this.question.id;
                }
                if (_this.question.type == "CHECKBOX") {
                    if (_this.instance.answer == null) {
                        _this.checkboxModel = [];
                        for (var i = 0; i < _this.question.options.length; i++) {
                            _this.checkboxModel[i] = false;
                        }
                    }
                    else {
                        _this.checkboxModel = JSON.parse(_this.instance.answer);
                    }
                }
                else if (_this.question.type == "MULTITEXT") {
                    if (_this.instance.answer == null) {
                        _this.multitextModel = [];
                        for (var i = 0; i < _this.question.options.length; i++) {
                            _this.multitextModel[i] = "";
                        }
                    }
                    else {
                        _this.multitextModel = JSON.parse(_this.instance.answer);
                    }
                }
            });
        });
    };
    QuestionInstanceComponent.prototype.save = function () {
        this.wizardService.updateQuestionInstance(this.instance);
    };
    QuestionInstanceComponent.prototype.onChangeHandler = function () {
        if (this.question.type == "CHECKBOX") {
            this.instance.answer = JSON.stringify(this.checkboxModel);
        }
        else if (this.question.type == "MULTITEXT") {
            this.instance.answer = JSON.stringify(this.multitextModel);
        }
        // this.onChange.emit(null);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], QuestionInstanceComponent.prototype, "reference_table", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], QuestionInstanceComponent.prototype, "reference_id", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], QuestionInstanceComponent.prototype, "reference_string", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", wizardquestion_class_1.WizardQuestion)
    ], QuestionInstanceComponent.prototype, "wizardQuestion", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], QuestionInstanceComponent.prototype, "read_only", void 0);
    QuestionInstanceComponent = __decorate([
        core_1.Component({
            selector: 'questioninstance',
            templateUrl: 'app_html/questioninstance.component.html',
            styleUrls: ['app_html/questioninstance.component.css'],
            viewProviders: [{ provide: forms_1.ControlContainer, useExisting: forms_1.NgForm }]
        }),
        __metadata("design:paramtypes", [router_1.Router, wizard_service_1.WizardService, settings_service_1.SettingsService])
    ], QuestionInstanceComponent);
    return QuestionInstanceComponent;
}());
exports.QuestionInstanceComponent = QuestionInstanceComponent;
