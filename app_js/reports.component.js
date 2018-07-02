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
var report_service_1 = require("./report.service");
var ReportsComponent = /** @class */ (function () {
    function ReportsComponent(router, reportService) {
        this.router = router;
        this.reportService = reportService;
        this.selectedReport = -1;
    }
    ReportsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.reportService.getReports().then(function (reports) {
            _this.selectedReport = -1;
            _this.reports = reports;
        });
    };
    ReportsComponent.prototype.reset = function () {
        this.ngOnInit();
    };
    ReportsComponent.prototype.goToDetails = function (p, i) {
        // something like thisthis should be the preferred way
        // let link = ['/reports', p.id];
        // this.router.navigate(link);
        this.selectedReport = i;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ReportsComponent.prototype, "parameters", void 0);
    ReportsComponent = __decorate([
        core_1.Component({
            selector: 'reports',
            templateUrl: 'app_html/reports.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, report_service_1.ReportService])
    ], ReportsComponent);
    return ReportsComponent;
}());
exports.ReportsComponent = ReportsComponent;
