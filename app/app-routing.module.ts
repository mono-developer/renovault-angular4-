import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyAccountComponent } from './partyaccount.component';
import { PartyAccountLoginComponent } from './partyaccountlogin.component';
// import { ObjectComponent } from './object.component';
import { ObjectDetailComponent } from './objectdetail.component';
import { ObjectsComponent } from './objects.component';
import { HoaDetailComponent } from './hoadetail.component';
import { HoasComponent } from './hoas.component';
import { PartyComponent } from './party.component';
import { PartyDetailComponent } from './partydetail.component';
import { PartyDetailSignedInPartyComponent } from './partydetailsignedinparty.component';
import { PartiesComponent } from './parties.component';
import { ProjectComponent } from './project.component';
import { ProjectDetailComponent } from './projectdetail.component';
import { ProjectsComponent } from './projects.component';
import { WizardComponent } from './wizard.component';
import { HomeComponent } from './home.component';
import { PartyAccountGuard, NoPartyAccountGuard, SettingsGuard, ObjectGuard, HoaGuard, AutoSaveStopMonitoringGuard } from './app-routing-guards';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home/1',
    pathMatch: 'full'
  },
  {
    path: 'partyaccount',
    component: PartyAccountComponent,
    canActivate: [NoPartyAccountGuard]
  },
  {
    path: 'partyaccountlogin',
    component: PartyAccountLoginComponent,
    canActivate: [PartyAccountGuard]
  },
  {
    path: 'partyaccountlogin/:action',
    component: PartyAccountLoginComponent,
    canActivate: [PartyAccountGuard]
  },
  {
    path: 'partyaccountlogin/:action/:param1',
    component: PartyAccountLoginComponent,
    canActivate: [PartyAccountGuard]
  },
  {
    path: 'partyaccountlogin/:action/:param1/:param2',
    component: PartyAccountLoginComponent,
    canActivate: [PartyAccountGuard]
  },
  {
    path: 'partyaccountlogin/:action/:param1/:param2/:param3',
    component: PartyAccountLoginComponent,
    canActivate: [PartyAccountGuard]
  },
  {
    path: 'objects',
    component: ObjectsComponent,
    canActivate: [NoPartyAccountGuard, ObjectGuard]
  },
  {
    path: 'objects/:id',
    component: ObjectDetailComponent,
    canActivate: [NoPartyAccountGuard, ObjectGuard],
    canDeactivate: [AutoSaveStopMonitoringGuard]
  },
  {
    path: 'hoas',
    component: HoasComponent,
    canActivate: [NoPartyAccountGuard, HoaGuard]
  },
  {
    path: 'hoas/:id',
    component: HoaDetailComponent,
    canActivate: [NoPartyAccountGuard, HoaGuard],
    canDeactivate: [AutoSaveStopMonitoringGuard]
  },
  {
    path: 'parties',
    component: PartiesComponent,
    canActivate: [NoPartyAccountGuard]
  },
  {
    path: 'parties/:id',
    component: PartyDetailComponent,
    canActivate: [NoPartyAccountGuard],
    canDeactivate: [AutoSaveStopMonitoringGuard]
  },
  {
    path: 'partydetailsignedinparty',
    component: PartyDetailSignedInPartyComponent,
    canActivate: [NoPartyAccountGuard],
    canDeactivate: [AutoSaveStopMonitoringGuard]
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [NoPartyAccountGuard]
  },
  {
    path: 'projects/:id',
    component: ProjectDetailComponent,
    canActivate: [NoPartyAccountGuard]
  },
  {
    path: 'home/:id',
    component: HomeComponent,
    canActivate: [SettingsGuard]
  },
  {
    path: '**',
    component: HomeComponent,
    canActivate: [SettingsGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }