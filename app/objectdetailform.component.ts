import { Component, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
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

@Component({
  selector: 'objectdetailform',
  templateUrl: 'app_html/objectdetailform.component.html',
  styleUrls: ['app_html/objectdetailform.component.css']
})

export class ObjectDetailFormComponent implements SaveableComponent {

  @Input()
  object: ObjectBean;

  @Input()
  read_only: boolean = false;

  @Output()
  onSave = new EventEmitter<any>();

  @Output()
  onHousepartsChanged = new EventEmitter<any>();

  housepartsChanged: boolean = false;

  @ViewChild('postalcodeInput')
  postalcodeInput: any;
  @ViewChild('housenumberInput')
  housenumberInput: any;
  @ViewChild('housenumberaddInput')
  housenumberaddInput: any;

  @ViewChild('googleMap')
  map: GooglemapComponent;

  @ViewChildren("objectDetailForm")
  objectDetailForms: QueryList<NgForm>
  objectDetailForm: NgForm = null;

  postalcodePattern: string = '^[1-9][0-9]{3}[A-Za-z]{2}$';
  postalcodeRegexp = new RegExp(this.postalcodePattern);
  housenumberPattern: string = '[0-9]+';
  housenumberRegexp = new RegExp(this.housenumberPattern);

  objecttypes = [
    { value: 'vrijstaand', display: 'Vrijstaand' },
    { value: '2-onder-1', display: '2-onder-1 kap' },
    { value: 'rijtjeswoning', display: 'Rijtjeswoning' },
    { value: 'appartement', display: 'Appartement' }
  ];

  objectsubtypes = [
    { value: 'hoekwoning', display: 'Hoekwoning' },
    { value: 'tussenwoning', display: 'Tussenwoning' }
  ];

  objectpositions = [
    { value: 'onder het dak', display: 'Onder het dak' },
    { value: 'op de onderste bouwlaag', display: 'Op de onderste bouwlaag' },
    { value: 'op een tussenverdieping', display: 'Op een tussenverdieping' },
    { value: 'onder het dak en op de onderste bouwlaag', display: 'Onder het dak EN op de onderste bouwlaag' }
  ];

  yesnos = [
    { value: 'yes', display: 'Ja' },
    { value: 'no', display: 'Nee' }
  ];

  familyadults = [
    { value: '1', display: '1 volwassene' },
    { value: '2', display: '2 volwassenen' }
  ];

  familychildren = [
    { value: '0', display: 'Geen kinderen' },
    { value: '1', display: '1 kind' },
    { value: '2', display: '2 kinderen' },
    { value: '3+', display: '3 of meer kinderen' },
  ];

  goals = [
    { value: 'registreren', display: 'Mijn huis beheren' },
    { value: 'verkoop', display: 'Mijn huis verkopen' },
    { value: 'comfort', display: 'Comfort verbeteren' },
    { value: 'duurzaamheid', display: 'Duurzaamheid verbeteren' },
  ];

  constructor(private objectService: ObjectService, private route: ActivatedRoute, private contentService: ContentService, private settingsService: SettingsService, private router: Router, private externalDatasetService: ExternalDatasetService, private breadcrumbsService: BreadcrumbsService, private autoSaveService: AutoSaveService) {
  }


  ngOnInit() {
    let params = this.route.snapshot.params;
    this.updateMap();
  }

  ngAfterViewInit() {
    this.objectDetailForms.changes.subscribe((comps: QueryList<NgForm>) => {
      if (this.objectDetailForm == null && comps.length > 0) {
        this.objectDetailForm = comps.first;
        this.startMonitoring();
      }
    });
  }

  save(): Promise<any> {

    // console.log('saving...');

    return this.objectService.updateObject(this.object)
      .then(object => {

        this.onSave.emit(null);

        if (this.housepartsChanged) {
          this.housepartsChanged = false;
          this.onHousepartsChanged.emit(null);
        }
      });
  }

  startMonitoring() {
    if (this.objectDetailForm != null && !this.read_only) {
      this.autoSaveService.startMonitoring(this, this.getNgForm());
    }
  }

  setHousepartsChanged() {
    this.housepartsChanged = true;
  }

  private getNgForm(): NgForm {
    return this.objectDetailForm;
  }

  lookup(event: Event) {
    this.object.postalcode = this.object.postalcode.replace(/\s/g, '');

    if (this.postalcodeRegexp.test(this.object.postalcode) && this.housenumberRegexp.test(this.object.housenumber)) {
      this.externalDatasetService.queryBag(this.object.postalcode, this.object.housenumber, this.object.housenumberadd)
        .then(result => {
          if (result == null) {
            this.object.lat = 0;
            this.object.lon = 0;
            this.object.street = "";
            this.object.city = "";
            this.object.bagurl = "";
            this.object.lookupdone = false;
          }
          else {
            this.object.lat = result.locatie.lat;
            this.object.lon = result.locatie.lon;
            this.object.street = result.openbareruimtenaam;
            this.object.city = result.gemeentenaam;
            this.object.bagurl = result.url;
            this.object.lookupdone = true;
            this.updateMap();
          }
        });
    }
  }

  private updateMap() {
    if (this.map) {
      this.map.update(this.object.lat, this.object.lon);
    }
  }

}