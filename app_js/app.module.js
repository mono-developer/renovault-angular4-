"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var animations_1 = require("@angular/platform-browser/animations");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var map_1 = require("@ngui/map");
var common_1 = require("@angular/common");
// import { Ng2BootstrapModule } from 'ngx-bootstrap';
var ngx_bootstrap_1 = require("ngx-bootstrap");
var ngx_bootstrap_2 = require("ngx-bootstrap");
var ngx_bootstrap_3 = require("ngx-bootstrap");
var ngx_bootstrap_4 = require("ngx-bootstrap");
var ngx_bootstrap_5 = require("ngx-bootstrap");
var ngx_bootstrap_6 = require("ngx-bootstrap");
var ngx_bootstrap_7 = require("ngx-bootstrap");
var ngx_bootstrap_8 = require("ngx-bootstrap");
var ngx_bootstrap_9 = require("ngx-bootstrap");
var ngx_bootstrap_10 = require("ngx-bootstrap");
var ng2_pdf_viewer_1 = require("ng2-pdf-viewer");
var angular_translator_1 = require("angular-translator");
var ng2_responsive_1 = require("ng2-responsive");
var values_pipe_1 = require("./values.pipe");
var app_component_1 = require("./app.component");
var app_routing_module_1 = require("./app-routing.module");
var template_component_1 = require("./template.component");
var partyaccount_component_1 = require("./partyaccount.component");
var partyaccountlogin_component_1 = require("./partyaccountlogin.component");
var objects_component_1 = require("./objects.component");
var object_component_1 = require("./object.component");
var objectdetail_component_1 = require("./objectdetail.component");
var objectdetailform_component_1 = require("./objectdetailform.component");
var hoas_component_1 = require("./hoas.component");
var hoa_component_1 = require("./hoa.component");
var hoadetail_component_1 = require("./hoadetail.component");
var hoadetailform_component_1 = require("./hoadetailform.component");
var parties_component_1 = require("./parties.component");
var party_component_1 = require("./party.component");
var partydetail_component_1 = require("./partydetail.component");
var partydetailsignedinparty_component_1 = require("./partydetailsignedinparty.component");
var projects_component_1 = require("./projects.component");
var project_component_1 = require("./project.component");
var projectdetail_component_1 = require("./projectdetail.component");
var googlemap_component_1 = require("./googlemap.component");
var wizard_component_1 = require("./wizard.component");
var wizard2_component_1 = require("./wizard2.component");
var home_component_1 = require("./home.component");
var questioninstances_component_1 = require("./questioninstances.component");
var questioninstance_component_1 = require("./questioninstance.component");
var images_component_1 = require("./images.component");
var image_component_1 = require("./image.component");
var messages_component_1 = require("./messages.component");
var typeahead_component_1 = require("./typeahead.component");
var reports_component_1 = require("./reports.component");
var reportdetail_component_1 = require("./reportdetail.component");
var share_component_1 = require("./share.component");
var appmenu_component_1 = require("./appmenu.component");
var breadcrumbs_component_1 = require("./breadcrumbs.component");
var party_service_1 = require("./party.service");
var partyaccount_service_1 = require("./partyaccount.service");
var image_service_1 = require("./image.service");
var object_service_1 = require("./object.service");
var hoa_service_1 = require("./hoa.service");
var project_service_1 = require("./project.service");
var wizard_service_1 = require("./wizard.service");
var message_service_1 = require("./message.service");
var content_service_1 = require("./content.service");
var settings_service_1 = require("./settings.service");
var security_service_1 = require("./security.service");
var report_service_1 = require("./report.service");
var externaldataset_service_1 = require("./externaldataset.service");
var breadcrumbs_service_1 = require("./breadcrumbs.service");
var autosave_service_1 = require("./autosave.service");
var app_routing_guards_1 = require("./app-routing-guards");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                animations_1.BrowserAnimationsModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                // AgmCoreModule.forRoot({ apiKey: 'AIzaSyCGPvDRvG8iI7rGGdC_DUPdDpLx7960myI' }),
                map_1.NguiMapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCGPvDRvG8iI7rGGdC_DUPdDpLx7960myI' }),
                common_1.CommonModule,
                // Ng2BootstrapModule.forRoot(),
                ngx_bootstrap_1.SortableModule.forRoot(),
                ngx_bootstrap_2.ButtonsModule.forRoot(),
                ngx_bootstrap_3.TabsModule.forRoot(),
                ngx_bootstrap_4.ModalModule.forRoot(),
                ngx_bootstrap_5.BsDatepickerModule.forRoot(),
                ngx_bootstrap_6.ProgressbarModule.forRoot(),
                ngx_bootstrap_7.AccordionModule.forRoot(),
                ngx_bootstrap_8.PopoverModule.forRoot(),
                ngx_bootstrap_9.AlertModule.forRoot(),
                ngx_bootstrap_10.TypeaheadModule.forRoot(),
                angular_translator_1.TranslatorModule.forRoot({
                    providedLanguages: ['nl', 'en', 'de', 'fr'],
                    defaultLanguage: 'nl',
                    loaderOptions: {
                        path: '/api/contentitem/{{language}}'
                    }
                }),
                ng2_responsive_1.ResponsiveModule,
                app_routing_module_1.AppRoutingModule
            ],
            declarations: [
                app_component_1.AppComponent,
                template_component_1.TemplateComponent,
                partyaccount_component_1.PartyAccountComponent,
                partyaccountlogin_component_1.PartyAccountLoginComponent,
                objects_component_1.ObjectsComponent,
                object_component_1.ObjectComponent,
                objectdetail_component_1.ObjectDetailComponent,
                objectdetailform_component_1.ObjectDetailFormComponent,
                hoas_component_1.HoasComponent,
                hoa_component_1.HoaComponent,
                hoadetail_component_1.HoaDetailComponent,
                hoadetailform_component_1.HoaDetailFormComponent,
                parties_component_1.PartiesComponent,
                party_component_1.PartyComponent,
                partydetail_component_1.PartyDetailComponent,
                partydetailsignedinparty_component_1.PartyDetailSignedInPartyComponent,
                projects_component_1.ProjectsComponent,
                project_component_1.ProjectComponent,
                projectdetail_component_1.ProjectDetailComponent,
                googlemap_component_1.GooglemapComponent,
                wizard_component_1.WizardComponent,
                wizard2_component_1.Wizard2Component,
                home_component_1.HomeComponent,
                questioninstances_component_1.QuestionInstancesComponent,
                questioninstance_component_1.QuestionInstanceComponent,
                images_component_1.ImagesComponent,
                image_component_1.ImageComponent,
                messages_component_1.MessagesComponent,
                ng2_pdf_viewer_1.PdfViewerComponent,
                typeahead_component_1.TypeaheadComponent,
                reports_component_1.ReportsComponent,
                reportdetail_component_1.ReportDetailComponent,
                share_component_1.ShareComponent,
                values_pipe_1.ValuesPipe,
                appmenu_component_1.AppMenuComponent,
                breadcrumbs_component_1.BreadcrumbsComponent
            ],
            providers: [
                party_service_1.PartyService,
                partyaccount_service_1.PartyAccountService,
                image_service_1.ImageService,
                object_service_1.ObjectService,
                hoa_service_1.HoaService,
                project_service_1.ProjectService,
                wizard_service_1.WizardService,
                message_service_1.MessageService,
                content_service_1.ContentService,
                settings_service_1.SettingsService,
                security_service_1.SecurityService,
                report_service_1.ReportService,
                externaldataset_service_1.ExternalDatasetService,
                breadcrumbs_service_1.BreadcrumbsService,
                autosave_service_1.AutoSaveService,
                app_routing_guards_1.PartyAccountGuard,
                app_routing_guards_1.NoPartyAccountGuard,
                app_routing_guards_1.SettingsGuard,
                app_routing_guards_1.ObjectGuard,
                app_routing_guards_1.HoaGuard,
                app_routing_guards_1.AutoSaveStopMonitoringGuard
            ],
            bootstrap: [app_component_1.AppComponent, appmenu_component_1.AppMenuComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
