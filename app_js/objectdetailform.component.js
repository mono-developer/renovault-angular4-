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
var objectbean_class_1 = require("./objectbean.class");
var object_service_1 = require("./object.service");
var googlemap_component_1 = require("./googlemap.component");
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
var externaldataset_service_1 = require("./externaldataset.service");
var breadcrumbs_service_1 = require("./breadcrumbs.service");
var autosave_service_1 = require("./autosave.service");
require("rxjs/add/operator/switchMap");
var ObjectDetailFormComponent = /** @class */ (function () {
    function ObjectDetailFormComponent(objectService, route, contentService, settingsService, router, externalDatasetService, breadcrumbsService, autoSaveService) {
        this.objectService = objectService;
        this.route = route;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.router = router;
        this.externalDatasetService = externalDatasetService;
        this.breadcrumbsService = breadcrumbsService;
        this.autoSaveService = autoSaveService;
        this.read_only = false;
        this.onSave = new core_1.EventEmitter();
        this.onHousepartsChanged = new core_1.EventEmitter();
        this.housepartsChanged = false;
        this.objectDetailForm = null;
        this.postalcodePattern = '^[1-9][0-9]{3}[A-Za-z]{2}$';
        this.postalcodeRegexp = new RegExp(this.postalcodePattern);
        this.housenumberPattern = '[0-9]+';
        this.housenumberRegexp = new RegExp(this.housenumberPattern);
        this.objecttypes = [
            { value: 'vrijstaand', display: 'Vrijstaand' },
            { value: '2-onder-1', display: '2-onder-1 kap' },
            { value: 'rijtjeswoning', display: 'Rijtjeswoning' },
            { value: 'appartement', display: 'Appartement' }
        ];
        this.objectsubtypes = [
            { value: 'hoekwoning', display: 'Hoekwoning' },
            { value: 'tussenwoning', display: 'Tussenwoning' }
        ];
        this.objectpositions = [
            { value: 'onder het dak', display: 'Onder het dak' },
            { value: 'op de onderste bouwlaag', display: 'Op de onderste bouwlaag' },
            { value: 'op een tussenverdieping', display: 'Op een tussenverdieping' },
            { value: 'onder het dak en op de onderste bouwlaag', display: 'Onder het dak EN op de onderste bouwlaag' }
        ];
        this.yesnos = [
            { value: 'yes', display: 'Ja' },
            { value: 'no', display: 'Nee' }
        ];
        this.familyadults = [
            { value: '1', display: '1 volwassene' },
            { value: '2', display: '2 volwassenen' }
        ];
        this.familychildren = [
            { value: '0', display: 'Geen kinderen' },
            { value: '1', display: '1 kind' },
            { value: '2', display: '2 kinderen' },
            { value: '3+', display: '3 of meer kinderen' },
        ];
        this.goals = [
            { value: 'registreren', display: 'Mijn huis beheren' },
            { value: 'verkoop', display: 'Mijn huis verkopen' },
            { value: 'comfort', display: 'Comfort verbeteren' },
            { value: 'duurzaamheid', display: 'Duurzaamheid verbeteren' },
        ];
    }
    ObjectDetailFormComponent.prototype.ngOnInit = function () {
        var params = this.route.snapshot.params;
        this.updateMap();
    };
    ObjectDetailFormComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.objectDetailForms.changes.subscribe(function (comps) {
            if (_this.objectDetailForm == null && comps.length > 0) {
                _this.objectDetailForm = comps.first;
                _this.startMonitoring();
            }
        });
    };
    ObjectDetailFormComponent.prototype.save = function () {
        // console.log('saving...');
        var _this = this;
        return this.objectService.updateObject(this.object)
            .then(function (object) {
            _this.onSave.emit(null);
            if (_this.housepartsChanged) {
                _this.housepartsChanged = false;
                _this.onHousepartsChanged.emit(null);
            }
        });
    };
    ObjectDetailFormComponent.prototype.startMonitoring = function () {
        if (this.objectDetailForm != null && !this.read_only) {
            this.autoSaveService.startMonitoring(this, this.getNgForm());
        }
    };
    ObjectDetailFormComponent.prototype.setHousepartsChanged = function () {
        this.housepartsChanged = true;
    };
    ObjectDetailFormComponent.prototype.getNgForm = function () {
        return this.objectDetailForm;
    };
    ObjectDetailFormComponent.prototype.lookup = function (event) {
        var _this = this;
        this.object.postalcode = this.object.postalcode.replace(/\s/g, '');
        if (this.postalcodeRegexp.test(this.object.postalcode) && this.housenumberRegexp.test(this.object.housenumber)) {
            this.externalDatasetService.queryBag(this.object.postalcode, this.object.housenumber, this.object.housenumberadd)
                .then(function (result) {
                if (result == null) {
                    _this.object.lat = 0;
                    _this.object.lon = 0;
                    _this.object.street = "";
                    _this.object.city = "";
                    _this.object.bagurl = "";
                    _this.object.lookupdone = false;
                }
                else {
                    _this.object.lat = result.locatie.lat;
                    _this.object.lon = result.locatie.lon;
                    _this.object.street = result.openbareruimtenaam;
                    _this.object.city = result.gemeentenaam;
                    _this.object.bagurl = result.url;
                    _this.object.lookupdone = true;
                    _this.updateMap();
                }
            });
        }
    };
    ObjectDetailFormComponent.prototype.updateMap = function () {
        if (this.map) {
            this.map.update(this.object.lat, this.object.lon);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", objectbean_class_1.ObjectBean)
    ], ObjectDetailFormComponent.prototype, "object", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ObjectDetailFormComponent.prototype, "read_only", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ObjectDetailFormComponent.prototype, "onSave", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ObjectDetailFormComponent.prototype, "onHousepartsChanged", void 0);
    __decorate([
        core_1.ViewChild('postalcodeInput'),
        __metadata("design:type", Object)
    ], ObjectDetailFormComponent.prototype, "postalcodeInput", void 0);
    __decorate([
        core_1.ViewChild('housenumberInput'),
        __metadata("design:type", Object)
    ], ObjectDetailFormComponent.prototype, "housenumberInput", void 0);
    __decorate([
        core_1.ViewChild('housenumberaddInput'),
        __metadata("design:type", Object)
    ], ObjectDetailFormComponent.prototype, "housenumberaddInput", void 0);
    __decorate([
        core_1.ViewChild('googleMap'),
        __metadata("design:type", googlemap_component_1.GooglemapComponent)
    ], ObjectDetailFormComponent.prototype, "map", void 0);
    __decorate([
        core_1.ViewChildren("objectDetailForm"),
        __metadata("design:type", core_1.QueryList)
    ], ObjectDetailFormComponent.prototype, "objectDetailForms", void 0);
    ObjectDetailFormComponent = __decorate([
        core_1.Component({
            selector: 'objectdetailform',
            templateUrl: 'app_html/objectdetailform.component.html',
            styleUrls: ['app_html/objectdetailform.component.css']
        }),
        __metadata("design:paramtypes", [object_service_1.ObjectService, router_1.ActivatedRoute, content_service_1.ContentService, settings_service_1.SettingsService, router_1.Router, externaldataset_service_1.ExternalDatasetService, breadcrumbs_service_1.BreadcrumbsService, autosave_service_1.AutoSaveService])
    ], ObjectDetailFormComponent);
    return ObjectDetailFormComponent;
}());
exports.ObjectDetailFormComponent = ObjectDetailFormComponent;
