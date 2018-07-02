"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var partyaccount_component_1 = require("./partyaccount.component");
var partyaccountlogin_component_1 = require("./partyaccountlogin.component");
// import { ObjectComponent } from './object.component';
var objectdetail_component_1 = require("./objectdetail.component");
var objects_component_1 = require("./objects.component");
var hoadetail_component_1 = require("./hoadetail.component");
var hoas_component_1 = require("./hoas.component");
var partydetail_component_1 = require("./partydetail.component");
var partydetailsignedinparty_component_1 = require("./partydetailsignedinparty.component");
var parties_component_1 = require("./parties.component");
var projectdetail_component_1 = require("./projectdetail.component");
var projects_component_1 = require("./projects.component");
var home_component_1 = require("./home.component");
var app_routing_guards_1 = require("./app-routing-guards");
var appRoutes = [
    {
        path: '',
        redirectTo: '/home/1',
        pathMatch: 'full'
    },
    {
        path: 'partyaccount',
        component: partyaccount_component_1.PartyAccountComponent,
        canActivate: [app_routing_guards_1.NoPartyAccountGuard]
    },
    {
        path: 'partyaccountlogin',
        component: partyaccountlogin_component_1.PartyAccountLoginComponent,
        canActivate: [app_routing_guards_1.PartyAccountGuard]
    },
    {
        path: 'partyaccountlogin/:action',
        component: partyaccountlogin_component_1.PartyAccountLoginComponent,
        canActivate: [app_routing_guards_1.PartyAccountGuard]
    },
    {
        path: 'partyaccountlogin/:action/:param1',
        component: partyaccountlogin_component_1.PartyAccountLoginComponent,
        canActivate: [app_routing_guards_1.PartyAccountGuard]
    },
    {
        path: 'partyaccountlogin/:action/:param1/:param2',
        component: partyaccountlogin_component_1.PartyAccountLoginComponent,
        canActivate: [app_routing_guards_1.PartyAccountGuard]
    },
    {
        path: 'partyaccountlogin/:action/:param1/:param2/:param3',
        component: partyaccountlogin_component_1.PartyAccountLoginComponent,
        canActivate: [app_routing_guards_1.PartyAccountGuard]
    },
    {
        path: 'objects',
        component: objects_component_1.ObjectsComponent,
        canActivate: [app_routing_guards_1.NoPartyAccountGuard, app_routing_guards_1.ObjectGuard]
    },
    {
        path: 'objects/:id',
        component: objectdetail_component_1.ObjectDetailComponent,
        canActivate: [app_routing_guards_1.NoPartyAccountGuard, app_routing_guards_1.ObjectGuard],
        canDeactivate: [app_routing_guards_1.AutoSaveStopMonitoringGuard]
    },
    {
        path: 'hoas',
        component: hoas_component_1.HoasComponent,
        canActivate: [app_routing_guards_1.NoPartyAccountGuard, app_routing_guards_1.HoaGuard]
    },
    {
        path: 'hoas/:id',
        component: hoadetail_component_1.HoaDetailComponent,
        canActivate: [app_routing_guards_1.NoPartyAccountGuard, app_routing_guards_1.HoaGuard],
        canDeactivate: [app_routing_guards_1.AutoSaveStopMonitoringGuard]
    },
    {
        path: 'parties',
        component: parties_component_1.PartiesComponent,
        canActivate: [app_routing_guards_1.NoPartyAccountGuard]
    },
    {
        path: 'parties/:id',
        component: partydetail_component_1.PartyDetailComponent,
        canActivate: [app_routing_guards_1.NoPartyAccountGuard],
        canDeactivate: [app_routing_guards_1.AutoSaveStopMonitoringGuard]
    },
    {
        path: 'partydetailsignedinparty',
        component: partydetailsignedinparty_component_1.PartyDetailSignedInPartyComponent,
        canActivate: [app_routing_guards_1.NoPartyAccountGuard],
        canDeactivate: [app_routing_guards_1.AutoSaveStopMonitoringGuard]
    },
    {
        path: 'projects',
        component: projects_component_1.ProjectsComponent,
        canActivate: [app_routing_guards_1.NoPartyAccountGuard]
    },
    {
        path: 'projects/:id',
        component: projectdetail_component_1.ProjectDetailComponent,
        canActivate: [app_routing_guards_1.NoPartyAccountGuard]
    },
    {
        path: 'home/:id',
        component: home_component_1.HomeComponent,
        canActivate: [app_routing_guards_1.SettingsGuard]
    },
    {
        path: '**',
        component: home_component_1.HomeComponent,
        canActivate: [app_routing_guards_1.SettingsGuard]
    }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forRoot(appRoutes)
            ],
            exports: [
                router_1.RouterModule
            ]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
