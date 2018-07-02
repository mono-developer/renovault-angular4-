import { Component, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
import { TypeaheadComponent } from './typeahead.component';
import { HoaMember } from './hoamember.class';
import { Party } from './party.class';
import { ObjectBean } from './objectbean.class';

@Component({
  selector: 'hoadetailform',
  templateUrl: 'app_html/hoadetailform.component.html',
  styleUrls: ['app_html/hoadetailform.component.css']
})

export class HoaDetailFormComponent implements SaveableComponent {

  @Input()
  hoa: Hoa;

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

  @ViewChildren("hoaDetailForm")
  hoaDetailForms: QueryList<NgForm>
  hoaDetailForm: NgForm = null;

  postalcodePattern: string = '^[1-9][0-9]{3}[A-Za-z]{2}$';
  postalcodeRegexp = new RegExp(this.postalcodePattern);
  housenumberPattern: string = '[0-9]+';
  housenumberRegexp = new RegExp(this.housenumberPattern);

  @ViewChild('objectTypeahead')
  objectTypeahead: TypeaheadComponent;

  selectedBeanAlreadyAdded: boolean = false;

  hoaMembers: HoaMember[] = [];

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

  constructor(private hoaService: HoaService, private route: ActivatedRoute, private contentService: ContentService, private settingsService: SettingsService, private router: Router, private externalDatasetService: ExternalDatasetService, private breadcrumbsService: BreadcrumbsService, private autoSaveService: AutoSaveService) {
  }


  ngOnInit() {
    let params = this.route.snapshot.params;
    this.updateMap();

    this.hoaService.getHoaMembers(this.hoa)
      .then(m => this.hoaMembers = m);
  }

  ngAfterViewInit() {
    this.hoaDetailForms.changes.subscribe((comps: QueryList<NgForm>) => {
      if (this.hoaDetailForm == null && comps.length > 0) {
        this.hoaDetailForm = comps.first;
        this.startMonitoring();
      }
    });
  }

  save(): Promise<any> {

    // console.log('saving...');

    return this.hoaService.updateHoa(this.hoa)
      .then(hoa => {

        this.onSave.emit(null);

        if (this.housepartsChanged) {
          this.housepartsChanged = false;
          this.onHousepartsChanged.emit(null);
        }
      });
  }

  startMonitoring() {
    if (this.hoaDetailForm != null && !this.read_only) {
      this.autoSaveService.startMonitoring(this, this.getNgForm());
    }
  }

  setHousepartsChanged() {
    this.housepartsChanged = true;
  }

  private getNgForm(): NgForm {
    return this.hoaDetailForm;
  }

  lookup(event: Event) {
    this.hoa.postalcode = this.hoa.postalcode.replace(/\s/g, '');

    if (this.postalcodeRegexp.test(this.hoa.postalcode) && this.housenumberRegexp.test(this.hoa.housenumber)) {
      this.externalDatasetService.queryBag(this.hoa.postalcode, this.hoa.housenumber, this.hoa.housenumberadd)
        .then(result => {
          if (result == null) {
            this.hoa.lat = 0;
            this.hoa.lon = 0;
            this.hoa.street = "";
            this.hoa.city = "";
            this.hoa.bagurl = "";
            this.hoa.lookupdone = false;
          }
          else {
            this.hoa.lat = result.locatie.lat;
            this.hoa.lon = result.locatie.lon;
            this.hoa.street = result.openbareruimtenaam;
            this.hoa.city = result.gemeentenaam;
            this.hoa.bagurl = result.url;
            this.hoa.lookupdone = true;
            this.updateMap();
          }
        });
    }
  }

  private updateMap() {
    if (this.map) {
      this.map.update(this.hoa.lat, this.hoa.lon);
    }
  }


  addHoaMember(object: ObjectBean) {
    var p: HoaMember = new HoaMember();

    p.hoaid = this.hoa.id;
    p.objectid = object.id;
    p.objectdisplaystring = object.getDisplayString();

    this.hoaService.addHoaMember(this.hoa, p)
      .then(m => {
        this.hoaMembers.push(m);
        this.objectTypeahead.reset();
      });
  }

  selectMemberParty(hoaMember: HoaMember, party: Party) {
    console.log(party);
    if (party) {
      hoaMember.ownerpartyid = party.id;
      hoaMember.ownerpartydisplaystring = party.getDisplayString();
      hoaMember.ownerpartyemail = party.email;
    } else {
      hoaMember.ownerpartyid = null;
      hoaMember.ownerpartydisplaystring = null;
      hoaMember.ownerpartyemail = null;
    }

    this.hoaService.updateHoaMember(this.hoa, hoaMember)
      .then(h => {
        //asdf
      });
  }

  deleteMember(hoaMember: HoaMember) {
    this.hoaService.deleteHoaMember(this.hoa, hoaMember)
      .then(h => {
        // delete from local members
        this.hoaMembers = this.hoaMembers.filter(o => o.id !== hoaMember.id);
        return h;
      });
  }

  onObjectselected() {
    this.selectedBeanAlreadyAdded = false;

    if (this.objectTypeahead.selectedBean) {
      let o: ObjectBean = this.objectTypeahead.selectedBean as ObjectBean;
      let s: HoaMember = this.hoaMembers.find(h => {
        return h.objectid == o.id;
      });

      if (s) {
        this.selectedBeanAlreadyAdded = true;
      }
    }
  }

}