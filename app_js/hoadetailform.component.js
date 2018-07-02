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
var hoa_class_1 = require("./hoa.class");
var hoa_service_1 = require("./hoa.service");
var googlemap_component_1 = require("./googlemap.component");
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
var externaldataset_service_1 = require("./externaldataset.service");
var breadcrumbs_service_1 = require("./breadcrumbs.service");
var autosave_service_1 = require("./autosave.service");
require("rxjs/add/operator/switchMap");
var typeahead_component_1 = require("./typeahead.component");
var hoamember_class_1 = require("./hoamember.class");
var HoaDetailFormComponent = /** @class */ (function () {
    function HoaDetailFormComponent(hoaService, route, contentService, settingsService, router, externalDatasetService, breadcrumbsService, autoSaveService) {
        this.hoaService = hoaService;
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
        this.hoaDetailForm = null;
        this.postalcodePattern = '^[1-9][0-9]{3}[A-Za-z]{2}$';
        this.postalcodeRegexp = new RegExp(this.postalcodePattern);
        this.housenumberPattern = '[0-9]+';
        this.housenumberRegexp = new RegExp(this.housenumberPattern);
        this.selectedBeanAlreadyAdded = false;
        this.hoaMembers = [];
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
    HoaDetailFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        var params = this.route.snapshot.params;
        this.updateMap();
        this.hoaService.getHoaMembers(this.hoa)
            .then(function (m) { return _this.hoaMembers = m; });
    };
    HoaDetailFormComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.hoaDetailForms.changes.subscribe(function (comps) {
            if (_this.hoaDetailForm == null && comps.length > 0) {
                _this.hoaDetailForm = comps.first;
                _this.startMonitoring();
            }
        });
    };
    HoaDetailFormComponent.prototype.save = function () {
        // console.log('saving...');
        var _this = this;
        return this.hoaService.updateHoa(this.hoa)
            .then(function (hoa) {
            _this.onSave.emit(null);
            if (_this.housepartsChanged) {
                _this.housepartsChanged = false;
                _this.onHousepartsChanged.emit(null);
            }
        });
    };
    HoaDetailFormComponent.prototype.startMonitoring = function () {
        if (this.hoaDetailForm != null && !this.read_only) {
            this.autoSaveService.startMonitoring(this, this.getNgForm());
        }
    };
    HoaDetailFormComponent.prototype.setHousepartsChanged = function () {
        this.housepartsChanged = true;
    };
    HoaDetailFormComponent.prototype.getNgForm = function () {
        return this.hoaDetailForm;
    };
    HoaDetailFormComponent.prototype.lookup = function (event) {
        var _this = this;
        this.hoa.postalcode = this.hoa.postalcode.replace(/\s/g, '');
        if (this.postalcodeRegexp.test(this.hoa.postalcode) && this.housenumberRegexp.test(this.hoa.housenumber)) {
            this.externalDatasetService.queryBag(this.hoa.postalcode, this.hoa.housenumber, this.hoa.housenumberadd)
                .then(function (result) {
                if (result == null) {
                    _this.hoa.lat = 0;
                    _this.hoa.lon = 0;
                    _this.hoa.street = "";
                    _this.hoa.city = "";
                    _this.hoa.bagurl = "";
                    _this.hoa.lookupdone = false;
                }
                else {
                    _this.hoa.lat = result.locatie.lat;
                    _this.hoa.lon = result.locatie.lon;
                    _this.hoa.street = result.openbareruimtenaam;
                    _this.hoa.city = result.gemeentenaam;
                    _this.hoa.bagurl = result.url;
                    _this.hoa.lookupdone = true;
                    _this.updateMap();
                }
            });
        }
    };
    HoaDetailFormComponent.prototype.updateMap = function () {
        if (this.map) {
            this.map.update(this.hoa.lat, this.hoa.lon);
        }
    };
    HoaDetailFormComponent.prototype.addHoaMember = function (object) {
        var _this = this;
        var p = new hoamember_class_1.HoaMember();
        p.hoaid = this.hoa.id;
        p.objectid = object.id;
        p.objectdisplaystring = object.getDisplayString();
        this.hoaService.addHoaMember(this.hoa, p)
            .then(function (m) {
            _this.hoaMembers.push(m);
            _this.objectTypeahead.reset();
        });
    };
    HoaDetailFormComponent.prototype.selectMemberParty = function (hoaMember, party) {
        console.log(party);
        if (party) {
            hoaMember.ownerpartyid = party.id;
            hoaMember.ownerpartydisplaystring = party.getDisplayString();
            hoaMember.ownerpartyemail = party.email;
        }
        else {
            hoaMember.ownerpartyid = null;
            hoaMember.ownerpartydisplaystring = null;
            hoaMember.ownerpartyemail = null;
        }
        this.hoaService.updateHoaMember(this.hoa, hoaMember)
            .then(function (h) {
            //asdf
        });
    };
    HoaDetailFormComponent.prototype.deleteMember = function (hoaMember) {
        var _this = this;
        this.hoaService.deleteHoaMember(this.hoa, hoaMember)
            .then(function (h) {
            // delete from local members
            _this.hoaMembers = _this.hoaMembers.filter(function (o) { return o.id !== hoaMember.id; });
            return h;
        });
    };
    HoaDetailFormComponent.prototype.onObjectselected = function () {
        this.selectedBeanAlreadyAdded = false;
        if (this.objectTypeahead.selectedBean) {
            var o_1 = this.objectTypeahead.selectedBean;
            var s = this.hoaMembers.find(function (h) {
                return h.objectid == o_1.id;
            });
            if (s) {
                this.selectedBeanAlreadyAdded = true;
            }
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", hoa_class_1.Hoa)
    ], HoaDetailFormComponent.prototype, "hoa", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], HoaDetailFormComponent.prototype, "read_only", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], HoaDetailFormComponent.prototype, "onSave", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], HoaDetailFormComponent.prototype, "onHousepartsChanged", void 0);
    __decorate([
        core_1.ViewChild('postalcodeInput'),
        __metadata("design:type", Object)
    ], HoaDetailFormComponent.prototype, "postalcodeInput", void 0);
    __decorate([
        core_1.ViewChild('housenumberInput'),
        __metadata("design:type", Object)
    ], HoaDetailFormComponent.prototype, "housenumberInput", void 0);
    __decorate([
        core_1.ViewChild('housenumberaddInput'),
        __metadata("design:type", Object)
    ], HoaDetailFormComponent.prototype, "housenumberaddInput", void 0);
    __decorate([
        core_1.ViewChild('googleMap'),
        __metadata("design:type", googlemap_component_1.GooglemapComponent)
    ], HoaDetailFormComponent.prototype, "map", void 0);
    __decorate([
        core_1.ViewChildren("hoaDetailForm"),
        __metadata("design:type", core_1.QueryList)
    ], HoaDetailFormComponent.prototype, "hoaDetailForms", void 0);
    __decorate([
        core_1.ViewChild('objectTypeahead'),
        __metadata("design:type", typeahead_component_1.TypeaheadComponent)
    ], HoaDetailFormComponent.prototype, "objectTypeahead", void 0);
    HoaDetailFormComponent = __decorate([
        core_1.Component({
            selector: 'hoadetailform',
            templateUrl: 'app_html/hoadetailform.component.html',
            styleUrls: ['app_html/hoadetailform.component.css']
        }),
        __metadata("design:paramtypes", [hoa_service_1.HoaService, router_1.ActivatedRoute, content_service_1.ContentService, settings_service_1.SettingsService, router_1.Router, externaldataset_service_1.ExternalDatasetService, breadcrumbs_service_1.BreadcrumbsService, autosave_service_1.AutoSaveService])
    ], HoaDetailFormComponent);
    return HoaDetailFormComponent;
}());
exports.HoaDetailFormComponent = HoaDetailFormComponent;
