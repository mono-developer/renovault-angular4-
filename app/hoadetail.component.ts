import { Component, Input, ViewChild, ViewChildren, QueryList, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Hoa } from './hoa.class';
import { HoaService } from './hoa.service';
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
import { HoaDetailFormComponent } from './hoadetailform.component';

@Component({
  selector: 'hoadetail',
  templateUrl: 'app_html/hoadetail.component.html'
})

export class HoaDetailComponent {

  @Input()
  hoa: Hoa;

  @ViewChild('hoaDetailForm')
  hoaDetailForm: HoaDetailFormComponent;

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

  constructor(private hoaService: HoaService, private route: ActivatedRoute, private location: Location, private contentService: ContentService, private settingsService: SettingsService, private router: Router, private externalDatasetService: ExternalDatasetService, private breadcrumbsService: BreadcrumbsService, private autoSaveService: AutoSaveService) {
  }


  ngOnInit() {


    this.settingsService.getMenuEnableHoas().then(s => this.enabled = (s == 'Y'));
    this.settingsService.getHoaDetailEnableHeading1().then(s => this.enabledHeading1 = (s == 'Y'));
    this.settingsService.getHoaDetailEnableHeading1Goals().then(s => this.enabledHeading1Goals = (s == 'Y'));
    this.settingsService.getHoaDetailEnableHeading2().then(s => this.enabledHeading2 = (s == 'Y'));
    this.settingsService.getHoaDetailEnableHeading3().then(s => this.enabledHeading3 = (s == 'Y'));
    this.settingsService.getHoaDetailEnableHeading4().then(s => this.enabledHeading4 = (s == 'Y'));
    this.settingsService.getHoaDetailEnableHeading5().then(s => this.enabledHeading5 = (s == 'Y'));
    this.settingsService.getHoaDetailEnableHeading6().then(s => this.enabledHeading6 = (s == 'Y'));
    this.settingsService.getHoaDetailShowTags().then(s => this.showTags = s);
    this.settingsService.getHoaDetailTagFiltersOverruledSelection().then(s => this.overruledTagfilter = s);


    // this.route.params.subscribe((params: Params) => {

    let params = this.route.snapshot.params;

    this.selectedHeading = params['selectedHeading'];

    let id = +params['id'];
    this.hoaService.getHoa(id)
      .then(hoa => {
        if (!hoa) {
          // maybe show message? later...
          this.router.navigate(['/hoas']);
        } else {


          this.hoa = hoa;
          this.read_only = this.hoa.granteerole != 'owner';

          // this.settingsService.getHoaDetailTagFilters().then(s => {

          //   var s: any[];

          //   if (this.hoa.tagfilterselection == null) {
          //     this.tagFilterModel = [];

          //     for (var i = 0; i < s.length; i++) {
          //       this.tagFilterModel[i] = false;
          //     }
          //   }
          //   else {
          //     this.tagFilterModel = JSON.parse(this.hoa.tagfilterselection);
          //   }

          //   if (this.hoa.tagfiltertag == null && s.length > 0) {
          //     this.hoa.tagfiltertag = s[0].tag;
          //     // this fix only works because tagfiltertag is not in use currently
          //     // this.tagFilterChangeHandler(false);
          //     // this.save();
          //   }

          //   this.tagFilterOptions = s;
          // });

          this.contentService.getContentItem('app.menu.hoas')
            .then(s => {
              this.parentBreadCrumbTitle = s;
              this.breadcrumbsService.reset();
              this.breadcrumbsService.pushCrumb(this.parentBreadCrumbTitle, '/hoas');
              this.breadcrumbsService.pushCrumb(hoa.getAddressDescription(), null);
            });
        }

      });
    // });

  }

  ngOnDestroy() {
    this.autoSaveService.stopMonitoring();
  }

  onSave() {
    // capture changes from hoadetailform here... maybe
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
    this.location.go('/hoas/' + this.hoa.id + ';selectedHeading=' + selectedHeading);

    this.autoSaveService.stopMonitoring();
    if (!this.read_only) {
      if (this.selectedHeading == 'heading1' && this.hoaDetailForm) {
        this.hoaDetailForm.startMonitoring();
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
  //     this.hoa.tagfilterselection = JSON.stringify(this.tagFilterModel);
  //     this.hoa.tagfiltertags = [];

  //     for (var i = 0; i < this.tagFilterOptions.length; i++) {
  //       if (this.tagFilterModel[i]) {
  //         this.hoa.tagfiltertags = this.hoa.tagfiltertags.concat(this.tagFilterOptions[i].tags);
  //       }
  //     }
  //   }
  //   else {
  //     this.hoa.tagfiltertags = [];
  //     this.hoa.tagfiltertags.push(this.hoa.tagfiltertag);
  //     this.hoa.tagfilterselection = null;
  //   }
  // }

  getTagFilterParameter() {
    var result = "";
    var tags = [];

    if (this.overruledTagfilter.length > 0) {
      tags = this.overruledTagfilter;
    }
    else if (this.hoa.tagfiltertags.length > 0) {
      tags = this.hoa.tagfiltertags;
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
    var a = this.hoa.housepartsexcluded;
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
    return 'hoa:' + this.hoa.id + '::' + this.getTagFilterParameter() + ':' + this.getHousepartsParameter();
  }

}