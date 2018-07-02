import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NguiMapModule } from '@ngui/map';
import { CommonModule } from '@angular/common';
// import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { SortableModule } from 'ngx-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { ProgressbarModule } from 'ngx-bootstrap';
import { AccordionModule } from 'ngx-bootstrap';
import { PopoverModule } from 'ngx-bootstrap';
import { AlertModule } from 'ngx-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap';



import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { TranslatorModule } from 'angular-translator';
import { ResponsiveModule } from 'ng2-responsive'

import { ValuesPipe } from './values.pipe';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TemplateComponent } from './template.component';
import { PartyAccountComponent } from './partyaccount.component';
import { PartyAccountLoginComponent } from './partyaccountlogin.component';
import { ObjectsComponent } from './objects.component';
import { ObjectComponent } from './object.component';
import { ObjectDetailComponent } from './objectdetail.component';
import { ObjectDetailFormComponent } from './objectdetailform.component';
import { HoasComponent } from './hoas.component';
import { HoaComponent } from './hoa.component';
import { HoaDetailComponent } from './hoadetail.component';
import { HoaDetailFormComponent } from './hoadetailform.component';
import { PartiesComponent } from './parties.component';
import { PartyComponent } from './party.component';
import { PartyDetailComponent } from './partydetail.component';
import { PartyDetailSignedInPartyComponent } from './partydetailsignedinparty.component';
import { ProjectsComponent } from './projects.component';
import { ProjectComponent } from './project.component';
import { ProjectDetailComponent } from './projectdetail.component';
import { GooglemapComponent } from './googlemap.component';
import { WizardComponent } from './wizard.component';
import { Wizard2Component } from './wizard2.component';
import { HomeComponent } from './home.component';
import { QuestionInstancesComponent } from './questioninstances.component';
import { QuestionInstanceComponent } from './questioninstance.component';
import { ImagesComponent } from './images.component';
import { ImageComponent } from './image.component';
import { MessagesComponent } from './messages.component';
import { TypeaheadComponent } from './typeahead.component';
import { ReportsComponent } from './reports.component';
import { ReportDetailComponent } from './reportdetail.component';
import { ShareComponent } from './share.component';
import { AppMenuComponent } from './appmenu.component';
import { BreadcrumbsComponent } from './breadcrumbs.component';

import { PartyService } from './party.service';
import { PartyAccountService } from './partyaccount.service';
import { ImageService } from './image.service';
import { ObjectService } from './object.service';
import { HoaService } from './hoa.service';
import { ProjectService } from './project.service';
import { WizardService } from './wizard.service';
import { MessageService } from './message.service';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';
import { SecurityService } from './security.service';
import { ReportService } from './report.service';
import { ExternalDatasetService } from './externaldataset.service';
import { BreadcrumbsService } from './breadcrumbs.service';
import { AutoSaveService } from './autosave.service';

import { PartyAccountGuard, NoPartyAccountGuard, SettingsGuard, ObjectGuard, HoaGuard, AutoSaveStopMonitoringGuard } from './app-routing-guards';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    // AgmCoreModule.forRoot({ apiKey: 'AIzaSyCGPvDRvG8iI7rGGdC_DUPdDpLx7960myI' }),
    NguiMapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCGPvDRvG8iI7rGGdC_DUPdDpLx7960myI' }),
    CommonModule,
    // Ng2BootstrapModule.forRoot(),
    SortableModule.forRoot(),
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ProgressbarModule.forRoot(),
    AccordionModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),

    TranslatorModule.forRoot({
      providedLanguages: ['nl', 'en', 'de', 'fr'],
      defaultLanguage: 'nl',
      loaderOptions: {
        path: '/api/contentitem/{{language}}'
      }
    }),
    ResponsiveModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    TemplateComponent,
    PartyAccountComponent,
    PartyAccountLoginComponent,
    ObjectsComponent,
    ObjectComponent,
    ObjectDetailComponent,
    ObjectDetailFormComponent,
    HoasComponent,
    HoaComponent,
    HoaDetailComponent,
    HoaDetailFormComponent,
    PartiesComponent,
    PartyComponent,
    PartyDetailComponent,
    PartyDetailSignedInPartyComponent,
    ProjectsComponent,
    ProjectComponent,
    ProjectDetailComponent,
    GooglemapComponent,
    WizardComponent,
    Wizard2Component,
    HomeComponent,
    QuestionInstancesComponent,
    QuestionInstanceComponent,
    ImagesComponent,
    ImageComponent,
    MessagesComponent,
    PdfViewerComponent,
    TypeaheadComponent,
    ReportsComponent,
    ReportDetailComponent,
    ShareComponent,
    ValuesPipe,
    AppMenuComponent,
    BreadcrumbsComponent
  ],
  providers: [
    PartyService,
    PartyAccountService,
    ImageService,
    ObjectService,
    HoaService,
    ProjectService,
    WizardService,
    MessageService,
    ContentService,
    SettingsService,
    SecurityService,
    ReportService,
    ExternalDatasetService,
    BreadcrumbsService,
    AutoSaveService,
    PartyAccountGuard,
    NoPartyAccountGuard,
    SettingsGuard,
    ObjectGuard,
    HoaGuard,
    AutoSaveStopMonitoringGuard
  ],
  bootstrap: [AppComponent, AppMenuComponent]
})
export class AppModule { }