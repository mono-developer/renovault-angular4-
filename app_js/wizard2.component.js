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
var wizard_service_1 = require("./wizard.service");
var settings_service_1 = require("./settings.service");
var report_service_1 = require("./report.service");
var autosave_service_1 = require("./autosave.service");
var Wizard2Component = /** @class */ (function () {
    // questionInstances: NgForm = null;
    function Wizard2Component(router, wizardService, settingsService, reportService, autoSaveService) {
        this.router = router;
        this.wizardService = wizardService;
        this.settingsService = settingsService;
        this.reportService = reportService;
        this.autoSaveService = autoSaveService;
        this.multipageShowParent = true;
        this.multipageAnswerId = -1;
        this.multipageAnswerText = '';
        this.showTags = 'N';
        this.treename = '';
        this.question_id = -1;
        this.answer_id = -1;
        this.read_only = false;
        this.hide_question_text = false;
        this.onSaveClicked = new core_1.EventEmitter();
    }
    Wizard2Component.prototype.ngOnInit = function () {
        // console.log('init wizard2: ' + this.treename);
        var _this = this;
        if (this.question_id == -1) {
            this.wizardService.getRootQuestion(this.treename, this.reference_table, this.reference_id, this.reference_string)
                .then(function (q) {
                if (q.length > 0 && q[0].type == 'NAVIGATION') {
                    _this.question_id = q[0].id;
                    _this.init(q[0], q, q[0].display);
                }
                else {
                    _this.init(null, null, 'QUESTIONS');
                }
            });
        }
        else if (this.question_id != -1 && this.answer_id != -1) {
            this.wizardService.getQuestionAfterAnswer(this.question_id, this.answer_id, this.reference_table, this.reference_id, this.reference_string)
                .then(function (q) {
                if (q.length > 0 && q[0].type == 'NAVIGATION') {
                    _this.init(q[0], q, q[0].display);
                }
                else {
                    _this.init(null, q, 'QUESTIONS');
                }
            });
        }
        this.settingsService.getObjectDetailShowTags()
            .then(function (s) { return _this.showTags = s; });
    };
    Wizard2Component.prototype.onClick = function (child_answer_id, child_answer_text) {
        this.multipageAnswerId = child_answer_id;
        this.multipageAnswerText = child_answer_text;
        this.multipageShowParent = false;
    };
    Wizard2Component.prototype.onClickBackBreadcrumb = function (event) {
        var _this = this;
        this.autoSaveService.saveImmediately()
            .then(function () {
            _this.multipageShowParent = true;
        });
    };
    Wizard2Component.prototype.onClickAccordionHeading = function (event) {
        this.autoSaveService.saveImmediately();
    };
    Wizard2Component.prototype.init = function (question, questions, display) {
        if (this.display == 'QUESTIONS') {
            this.autoSaveService.stopMonitoring();
        }
        this.wizardQuestion = question;
        this.wizardQuestions = questions;
        this.display = display;
        this.initProgress(null);
    };
    Wizard2Component.prototype.startMonitoring = function () {
        // console.log('starting monitoring : ' + this.reference_string);
        if (!this.read_only) {
            if (this.visibleChildrenList) {
                this.visibleChildrenList.forEach(function (child) {
                    child.startMonitoring();
                });
            }
        }
    };
    Wizard2Component.prototype.save = function () {
        return Promise.resolve();
    };
    Wizard2Component.prototype.initProgress = function (reference_string) {
        var _this = this;
        if (this.wizardQuestion != null && this.wizardQuestion.navigation_answers.length > 0) {
            this.reportService.getReport('report1')
                .then(function (r) {
                // console.log('initprogress : ' + reference_string);
                _this.wizardQuestion.navigation_answers
                    .filter(function (answer) {
                    var ref_string = _this.reference_string + '~' + _this.wizardQuestion.id + '~' + '~' + answer.id + '~';
                    return reference_string == null || ref_string == reference_string; //filter based on reference string;
                })
                    .forEach(function (answer) {
                    var ref_string = _this.reference_string + '~' + _this.wizardQuestion.id + '~' + '~' + answer.id + '~';
                    var params = _this.reference_table + ':' + _this.reference_id + ':' + ref_string + ':' + _this.tagfilterparameter;
                    _this.reportService.getData(r, params)
                        .then(function (result) {
                        answer.no_of_answers = 0;
                        answer.no_of_questions = 0;
                        if (result != null && result.dataset1 != null) {
                            result.dataset1.forEach(function (progress) {
                                answer.no_of_answers += progress.answers;
                                answer.no_of_questions += progress.questions;
                            });
                        }
                        answer.normalized_no_of_questions = 5;
                        answer.normalized_no_of_answers = (answer.no_of_answers / answer.no_of_questions) * answer.normalized_no_of_questions;
                    });
                });
            });
        }
    };
    Wizard2Component.prototype.saveClicked = function (reference_string) {
        var _this = this;
        // console.log('wizard2 save : ' + this.reference_string + ' : event ref : ' + reference_string);
        setTimeout(function () {
            _this.initProgress(reference_string);
        }, 2000);
        this.onSaveClicked.emit(this.reference_string);
    };
    Wizard2Component.prototype.reset = function () {
        this.question_id = -1;
        this.answer_id = -1;
        this.multipageShowParent = true;
        this.multipageAnswerId = -1;
        this.multipageAnswerText = '';
        this.ngOnInit();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], Wizard2Component.prototype, "treename", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], Wizard2Component.prototype, "question_id", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], Wizard2Component.prototype, "answer_id", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], Wizard2Component.prototype, "reference_table", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], Wizard2Component.prototype, "reference_id", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], Wizard2Component.prototype, "reference_string", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], Wizard2Component.prototype, "tagfilterparameter", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], Wizard2Component.prototype, "read_only", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], Wizard2Component.prototype, "hide_question_text", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], Wizard2Component.prototype, "onSaveClicked", void 0);
    __decorate([
        core_1.ViewChildren("visibleChild"),
        __metadata("design:type", core_1.QueryList)
    ], Wizard2Component.prototype, "visibleChildrenList", void 0);
    Wizard2Component = __decorate([
        core_1.Component({
            selector: 'wizard2',
            templateUrl: 'app_html/wizard2.component.html',
            styleUrls: ['app_html/wizard2.component.css']
        }),
        __metadata("design:paramtypes", [router_1.Router, wizard_service_1.WizardService, settings_service_1.SettingsService, report_service_1.ReportService, autosave_service_1.AutoSaveService])
    ], Wizard2Component);
    return Wizard2Component;
}());
exports.Wizard2Component = Wizard2Component;
