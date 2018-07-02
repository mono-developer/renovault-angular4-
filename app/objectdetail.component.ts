import { Component, Input, ViewChild, ViewChildren, QueryList, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { ObjectBean } from './objectbean.class';
import { ObjectService } from './object.service';
import { Wizard2Component } from './wizard2.component';
import { ReportsComponent } from './reports.component';
import { ReportDetailComponent } from './reportdetail.component';
import { GooglemapComponent } from './googlemap.component';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';
import { ExternalDatasetService } from './externaldataset.service';
import { BreadcrumbsService } from './breadcrumbs.service';
import { AutoSaveService } from './autosave.service';
import 'rxjs/add/operator/switchMap';
import { SaveableComponent } from './saveablecomponent.class';
import { ObjectDetailFormComponent } from './objectdetailform.component';

@Component({
  selector: 'objectdetail',
  templateUrl: 'app_html/objectdetail.component.html'
})

export class ObjectDetailComponent {

  @Input()
  object: ObjectBean;

  @ViewChild('objectDetailForm')
  objectDetailForm: ObjectDetailFormComponent;

  @ViewChild('housePartsWizard')
  housePartsWizard: Wizard2Component;

  @ViewChild('documentsWizard')
  documentsWizard: Wizard2Component;

  @ViewChild('reportsWizard')
  reportsWizard: Wizard2Component;

  @ViewChild('reportsComponent')
  reportsComponent: ReportsComponent;

  @ViewChild('mjopReportComponent')
  mjopReportComponent: ReportDetailComponent;

  enabled: boolean = false;
  enabledHeading1: boolean = false;
  enabledHeading1Goals: boolean = false;
  enabledHeading2: boolean = false;
  enabledHeading3: boolean = false;
  enabledHeading4: boolean = false;
  enabledHeading5: boolean = false;
  enabledHeading6: boolean = false;

  tagFilterOptions: any[];
  tagFilterModel: boolean[];
  tagFilterSelectedTags: string[];
  tagFilter: string[];
  overruledTagfilter: any[];

  showTags: string = "N";

  selectedHeading: string = "";

  read_only: boolean = false;

  parentBreadCrumbTitle = "";

  constructor(private objectService: ObjectService, private route: ActivatedRoute, private location: Location, private contentService: ContentService, private settingsService: SettingsService, private router: Router, private externalDatasetService: ExternalDatasetService, private breadcrumbsService: BreadcrumbsService, private autoSaveService: AutoSaveService) {
  }


  ngOnInit() {


    this.settingsService.getMenuEnableObjects().then(s => this.enabled = (s == 'Y'));
    this.settingsService.getObjectDetailEnableHeading1().then(s => this.enabledHeading1 = (s == 'Y'));
    this.settingsService.getObjectDetailEnableHeading1Goals().then(s => this.enabledHeading1Goals = (s == 'Y'));
    this.settingsService.getObjectDetailEnableHeading2().then(s => this.enabledHeading2 = (s == 'Y'));
    this.settingsService.getObjectDetailEnableHeading3().then(s => this.enabledHeading3 = (s == 'Y'));
    this.settingsService.getObjectDetailEnableHeading4().then(s => this.enabledHeading4 = (s == 'Y'));
    this.settingsService.getObjectDetailEnableHeading5().then(s => this.enabledHeading5 = (s == 'Y'));
    this.settingsService.getObjectDetailEnableHeading6().then(s => this.enabledHeading6 = (s == 'Y'));
    this.settingsService.getObjectDetailShowTags().then(s => this.showTags = s);
    this.settingsService.getObjectDetailTagFiltersOverruledSelection().then(s => this.overruledTagfilter = s);


    // this.route.params.subscribe((params: Params) => {

    let params = this.route.snapshot.params;

    this.selectedHeading = params['selectedHeading'];

    let id = +params['id'];
    this.objectService.getObject(id)
      .then(object => {
        if (!object) {
          // maybe show message? later...
          this.router.navigate(['/objects']);
        } else {


          this.object = object;
          this.read_only = this.object.granteerole != 'owner';

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

          this.contentService.getContentItem('app.menu.objects')
            .then(s => {
              this.parentBreadCrumbTitle = s;
              this.breadcrumbsService.reset();
              this.breadcrumbsService.pushCrumb(this.parentBreadCrumbTitle, '/objects');
              this.breadcrumbsService.pushCrumb(object.getAddressDescription(), null);
            });
        }

      });
    // });

  }

  ngOnDestroy() {
    this.autoSaveService.stopMonitoring();
  }

  onSave() {
    // capture changes from objectdetailform here... maybe
  }

  onHousepartsChanged() {
    if (!this.read_only) {
      if (this.documentsWizard) {
        this.housePartsWizard.reset();
      }

      if (this.mjopReportComponent) {
        this.mjopReportComponent.parameters = this.getReportDetailParameterString();
        this.mjopReportComponent.reset();
      }
    }
  }

  private select(selectedHeading: string) {
    this.selectedHeading = selectedHeading;
    this.location.go('/objects/' + this.object.id + ';selectedHeading=' + selectedHeading);

    this.autoSaveService.stopMonitoring();
    if (!this.read_only) {
      if (this.selectedHeading == 'heading1' && this.objectDetailForm) {
        this.objectDetailForm.startMonitoring();
      } else if (this.selectedHeading == 'heading2' && this.documentsWizard) {
        this.documentsWizard.startMonitoring();
      } else if (this.selectedHeading == 'heading3' && this.housePartsWizard) {
        this.housePartsWizard.startMonitoring();
      } else if (this.selectedHeading == 'heading4' && this.reportsWizard) {
        this.reportsWizard.startMonitoring();
      }
    }
  }

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

  getTagFilterParameter() {
    var result = "";
    var tags = [];

    if (this.overruledTagfilter.length > 0) {
      tags = this.overruledTagfilter;
    }
    else if (this.object.tagfiltertags.length > 0) {
      tags = this.object.tagfiltertags;
    }

    if (tags.length != null && tags.length > 0) {
      var sorted = tags.sort()
      result += "";
      sorted.forEach(tag => {
        result += tag;
      });
    }
    else {
      result = '*';
    }

    return result;
  }

  getHousepartsParameter() {
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
  }

  getReportDetailParameterString() {
    return 'object:' + this.object.id + '::' + this.getTagFilterParameter() + ':' + this.getHousepartsParameter();
  }

}