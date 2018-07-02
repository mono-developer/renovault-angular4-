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
var report_service_1 = require("./report.service");
var ReportDetailComponent = /** @class */ (function () {
    function ReportDetailComponent(reportService) {
        this.reportService = reportService;
    }
    ReportDetailComponent.prototype.ngOnInit = function () {
        this.reset();
    };
    ReportDetailComponent.prototype.reset = function () {
        var _this = this;
        this.reportService.getReport(this.reportName)
            .then(function (report) {
            _this.report = report;
            _this.reportService.getData(_this.report, _this.parameters)
                .then(function (data) {
                _this.datasets = data;
            });
        });
        this.variables = {};
    };
    ReportDetailComponent.prototype.log = function (something) {
        console.log(something);
    };
    ReportDetailComponent.prototype.getArrayValue = function (arr, compareField, compareValue, retrieveField) {
        if (arr != null && arr.length > 0) {
            var tmp = arr.find(function (element) { return element[compareField] == compareValue; });
            if (tmp != null) {
                return tmp[retrieveField];
            }
        }
        return null;
    };
    ReportDetailComponent.prototype.getArray = function (arr, compareField, compareValue) {
        if (arr != null && arr.length > 0) {
            return arr.filter(function (element) { return element[compareField] == compareValue; });
        }
        else {
            return [];
        }
    };
    ReportDetailComponent.prototype.storeVar = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        for (var i = 0; i < arguments.length; i = i + 2) {
            this.variables[args[i]] = arguments[i + 1];
        }
        return true;
    };
    ReportDetailComponent.prototype.getVar = function (key) {
        return this.variables[key];
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ReportDetailComponent.prototype, "reportName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ReportDetailComponent.prototype, "parameters", void 0);
    ReportDetailComponent = __decorate([
        core_1.Component({
            selector: 'reportdetail',
            templateUrl: '/api/report/template'
        }),
        __metadata("design:paramtypes", [report_service_1.ReportService])
    ], ReportDetailComponent);
    return ReportDetailComponent;
}());
exports.ReportDetailComponent = ReportDetailComponent;
