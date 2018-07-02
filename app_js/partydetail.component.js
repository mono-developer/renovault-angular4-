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
var party_class_1 = require("./party.class");
var party_service_1 = require("./party.service");
var message_service_1 = require("./message.service");
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
var breadcrumbs_service_1 = require("./breadcrumbs.service");
var autosave_service_1 = require("./autosave.service");
var PartyDetailComponent = /** @class */ (function () {
    function PartyDetailComponent(router, route, partyService, messageService, contentService, settingsService, breadcrumbsService, autoSaveService) {
        this.router = router;
        this.route = route;
        this.partyService = partyService;
        this.messageService = messageService;
        this.contentService = contentService;
        this.settingsService = settingsService;
        this.breadcrumbsService = breadcrumbsService;
        this.autoSaveService = autoSaveService;
        this.enabled = true;
        this.onSave = new core_1.EventEmitter();
        // @ViewChildren("partyDetailForm")
        // partyDetailForms: QueryList<NgForm>;
        this.partyDetailForm = null;
        this.partytypes = [
            { value: 'houseowner', display: 'Huiseigenaar' },
            { value: 'contractor', display: 'Aannemer' },
            { value: 'supplier', display: 'Leverancier' },
            { value: 'association', display: 'Vereniging van Eigenaren' }
        ];
        this.partytitles = [
            { value: 'dhr', display: 'Dhr.' },
            { value: 'mevr', display: 'Mevr.' },
        ];
    }
    PartyDetailComponent.prototype.ngOnInit = function () {
        // this.settingsService.getMenuEnableParties().then(s => this.enabled = (s == 'Y'));
        var _this = this;
        if (this.party == null) {
            this.route.params.forEach(function (params) {
                var id = +params['id'];
                _this.partyService.getParty(id)
                    .then(function (p) {
                    _this.party = p;
                    _this.contentService.getContentItem('app.menu.parties')
                        .then(function (s) {
                        _this.breadcrumbsService.reset();
                        _this.breadcrumbsService.pushCrumb(s, '/parties');
                        _this.breadcrumbsService.pushCrumb(p.getDisplayString(), null);
                    });
                });
            });
        }
        if (this.partyDetailForm) {
            this.startMonitoring();
        }
    };
    // ngAfterViewInit() {
    //     this.partyDetailForms.changes
    //         .subscribe((comps: QueryList<NgForm>) => {
    //             if (!this.partyDetailForm && comps.length > 0) {
    //                 this.partyDetailForm = comps.first;
    //             }
    //             this.startMonitoring();
    //         });
    // }
    PartyDetailComponent.prototype.save = function () {
        var _this = this;
        return this.partyService.updateParty(this.party)
            .then(function (p) {
            _this.party = party_class_1.Party.parse(p);
            _this.onSave.emit(_this.party);
        });
    };
    PartyDetailComponent.prototype.startMonitoring = function () {
        if (this.partyDetailForm) {
            this.autoSaveService.startMonitoring(this, this.getNgForm());
        }
    };
    PartyDetailComponent.prototype.getNgForm = function () {
        return this.partyDetailForm;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", party_class_1.Party)
    ], PartyDetailComponent.prototype, "party", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], PartyDetailComponent.prototype, "onSave", void 0);
    __decorate([
        core_1.ViewChild("partyDetailForm"),
        __metadata("design:type", forms_1.NgForm)
    ], PartyDetailComponent.prototype, "partyDetailForm", void 0);
    PartyDetailComponent = __decorate([
        core_1.Component({
            selector: 'partydetail',
            templateUrl: 'app_html/partydetail.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, party_service_1.PartyService, message_service_1.MessageService, content_service_1.ContentService, settings_service_1.SettingsService, breadcrumbs_service_1.BreadcrumbsService, autosave_service_1.AutoSaveService])
    ], PartyDetailComponent);
    return PartyDetailComponent;
}());
exports.PartyDetailComponent = PartyDetailComponent;
