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
var common_1 = require("@angular/common");
var objectbean_class_1 = require("./objectbean.class");
var object_service_1 = require("./object.service");
var wizard2_component_1 = require("./wizard2.component");
var reports_component_1 = require("./reports.component");
var reportdetail_component_1 = require("./reportdetail.component");
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
var externaldataset_service_1 = require("./externaldataset.service");
var breadcrumbs_service_1 = require("./breadcrumbs.service");
var autosave_service_1 = require("./autosave.service");
require("rxjs/add/operator/switchMap");
var objectdetailform_component_1 = require("./objectdetailform.component");
var ObjectDetailComponent = /** @class */ (function () {
    function ObjectDetailComponent(objectService, route, location, contentService, settingsService, router, externalDatasetService, breadcrumbsService, autoSaveService) {
        this.objectService = objectService;
        this.route = route;
        this.location = location;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.router = router;
        this.externalDatasetService = externalDatasetService;
        this.breadcrumbsService = breadcrumbsService;
        this.autoSaveService = autoSaveService;
        this.enabled = false;
        this.enabledHeading1 = false;
        this.enabledHeading1Goals = false;
        this.enabledHeading2 = false;
        this.enabledHeading3 = false;
        this.enabledHeading4 = false;
        this.enabledHeading5 = false;
        this.enabledHeading6 = false;
        this.showTags = "N";
        this.selectedHeading = "";
        this.read_only = false;
        this.parentBreadCrumbTitle = "";
    }
    ObjectDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.settingsService.getMenuEnableObjects().then(function (s) { return _this.enabled = (s == 'Y'); });
        this.settingsService.getObjectDetailEnableHeading1().then(function (s) { return _this.enabledHeading1 = (s == 'Y'); });
        this.settingsService.getObjectDetailEnableHeading1Goals().then(function (s) { return _this.enabledHeading1Goals = (s == 'Y'); });
        this.settingsService.getObjectDetailEnableHeading2().then(function (s) { return _this.enabledHeading2 = (s == 'Y'); });
        this.settingsService.getObjectDetailEnableHeading3().then(function (s) { return _this.enabledHeading3 = (s == 'Y'); });
        this.settingsService.getObjectDetailEnableHeading4().then(function (s) { return _this.enabledHeading4 = (s == 'Y'); });
        this.settingsService.getObjectDetailEnableHeading5().then(function (s) { return _this.enabledHeading5 = (s == 'Y'); });
        this.settingsService.getObjectDetailEnableHeading6().then(function (s) { return _this.enabledHeading6 = (s == 'Y'); });
        this.settingsService.getObjectDetailShowTags().then(function (s) { return _this.showTags = s; });
        this.settingsService.getObjectDetailTagFiltersOverruledSelection().then(function (s) { return _this.overruledTagfilter = s; });
        // this.route.params.subscribe((params: Params) => {
        var params = this.route.snapshot.params;
        this.selectedHeading = params['selectedHeading'];
        var id = +params['id'];
        this.objectService.getObject(id)
            .then(function (object) {
            if (!object) {
                // maybe show message? later...
                _this.router.navigate(['/objects']);
            }
            else {
                _this.object = object;
                _this.read_only = _this.object.granteerole != 'owner';
                // this.settingsService.getObjectDetailTagFilters().then(s => {
                //   var s: any[];
                //   if (this.object.tagfilterselection == null) {
                //     this.tagFilterModel = [];
                //     for (var i = 0; i < s.length; i++) {
                //       this.tagFilterModel[i] = false;
                //     }
                //   }
                //   else {
                //     this.tagFilterModel = JSON.parse(this.object.tagfilterselection);
                //   }
                //   if (this.object.tagfiltertag == null && s.length > 0) {
                //     this.object.tagfiltertag = s[0].tag;
                //     // this fix only works because tagfiltertag is not in use currently
                //     // this.tagFilterChangeHandler(false);
                //     // this.save();
                //   }
                //   this.tagFilterOptions = s;
                // });
                _this.contentService.getContentItem('app.menu.objects')
                    .then(function (s) {
                    _this.parentBreadCrumbTitle = s;
                    _this.breadcrumbsService.reset();
                    _this.breadcrumbsService.pushCrumb(_this.parentBreadCrumbTitle, '/objects');
                    _this.breadcrumbsService.pushCrumb(object.getAddressDescription(), null);
                });
            }
        });
        // });
    };
    ObjectDetailComponent.prototype.ngOnDestroy = function () {
        this.autoSaveService.stopMonitoring();
    };
    ObjectDetailComponent.prototype.onSave = function () {
        // capture changes from objectdetailform here... maybe
    };
    ObjectDetailComponent.prototype.onHousepartsChanged = function () {
        if (!this.read_only) {
            if (this.documentsWizard) {
                this.housePartsWizard.reset();
            }
            if (this.mjopReportComponent) {
                this.mjopReportComponent.parameters = this.getReportDetailParameterString();
                this.mjopReportComponent.reset();
            }
        }
    };
    ObjectDetailComponent.prototype.select = function (selectedHeading) {
        this.selectedHeading = selectedHeading;
        this.location.go('/objects/' + this.object.id + ';selectedHeading=' + selectedHeading);
        this.autoSaveService.stopMonitoring();
        if (!this.read_only) {
            if (this.selectedHeading == 'heading1' && this.objectDetailForm) {
                this.objectDetailForm.startMonitoring();
            }
            else if (this.selectedHeading == 'heading2' && this.documentsWizard) {
                this.documentsWizard.startMonitoring();
            }
            else if (this.selectedHeading == 'heading3' && this.housePartsWizard) {
                this.housePartsWizard.startMonitoring();
            }
            else if (this.selectedHeading == 'heading4' && this.reportsWizard) {
                this.reportsWizard.startMonitoring();
            }
        }
    };
    // tagFilterChangeHandler(multiSelect: boolean) {
    //   if (multiSelect) {
    //     this.object.tagfilterselection = JSON.stringify(this.tagFilterModel);
    //     this.object.tagfiltertags = [];
    //     for (var i = 0; i < this.tagFilterOptions.length; i++) {
    //       if (this.tagFilterModel[i]) {
    //         this.object.tagfiltertags = this.object.tagfiltertags.concat(this.tagFilterOptions[i].tags);
    //       }
    //     }
    //   }
    //   else {
    //     this.object.tagfiltertags = [];
    //     this.object.tagfiltertags.push(this.object.tagfiltertag);
    //     this.object.tagfilterselection = null;
    //   }
    // }
    ObjectDetailComponent.prototype.getTagFilterParameter = function () {
        var result = "";
        var tags = [];
        if (this.overruledTagfilter.length > 0) {
            tags = this.overruledTagfilter;
        }
        else if (this.object.tagfiltertags.length > 0) {
            tags = this.object.tagfiltertags;
        }
        if (tags.length != null && tags.length > 0) {
            var sorted = tags.sort();
            result += "";
            sorted.forEach(function (tag) {
                result += tag;
            });
        }
        else {
            result = '*';
        }
        return result;
    };
    ObjectDetailComponent.prototype.getHousepartsParameter = function () {
        var a = this.object.housepartsexcluded;
        var result = "";
        if (a.length > 0) {
            for (var i = 0; i < a.length; i++) {
                var housepart = a[i];
                result += housepart + ',';
            }
        }
        result += '-1';
        return result;
    };
    ObjectDetailComponent.prototype.getReportDetailParameterString = function () {
        return 'object:' + this.object.id + '::' + this.getTagFilterParameter() + ':' + this.getHousepartsParameter();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", objectbean_class_1.ObjectBean)
    ], ObjectDetailComponent.prototype, "object", void 0);
    __decorate([
        core_1.ViewChild('objectDetailForm'),
        __metadata("design:type", objectdetailform_component_1.ObjectDetailFormComponent)
    ], ObjectDetailComponent.prototype, "objectDetailForm", void 0);
    __decorate([
        core_1.ViewChild('housePartsWizard'),
        __metadata("design:type", wizard2_component_1.Wizard2Component)
    ], ObjectDetailComponent.prototype, "housePartsWizard", void 0);
    __decorate([
        core_1.ViewChild('documentsWizard'),
        __metadata("design:type", wizard2_component_1.Wizard2Component)
    ], ObjectDetailComponent.prototype, "documentsWizard", void 0);
    __decorate([
        core_1.ViewChild('reportsWizard'),
        __metadata("design:type", wizard2_component_1.Wizard2Component)
    ], ObjectDetailComponent.prototype, "reportsWizard", void 0);
    __decorate([
        core_1.ViewChild('reportsComponent'),
        __metadata("design:type", reports_component_1.ReportsComponent)
    ], ObjectDetailComponent.prototype, "reportsComponent", void 0);
    __decorate([
        core_1.ViewChild('mjopReportComponent'),
        __metadata("design:type", reportdetail_component_1.ReportDetailComponent)
    ], ObjectDetailComponent.prototype, "mjopReportComponent", void 0);
    ObjectDetailComponent = __decorate([
        core_1.Component({
            selector: 'objectdetail',
            templateUrl: 'app_html/objectdetail.component.html'
        }),
        __metadata("design:paramtypes", [object_service_1.ObjectService, router_1.ActivatedRoute, common_1.Location, content_service_1.ContentService, settings_service_1.SettingsService, router_1.Router, externaldataset_service_1.ExternalDatasetService, breadcrumbs_service_1.BreadcrumbsService, autosave_service_1.AutoSaveService])
    ], ObjectDetailComponent);
    return ObjectDetailComponent;
}());
exports.ObjectDetailComponent = ObjectDetailComponent;
