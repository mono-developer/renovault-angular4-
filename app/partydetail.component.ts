import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Party } from './party.class';
import { PartyService } from './party.service';
import { MessageService } from './message.service';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';
import { BreadcrumbsService } from './breadcrumbs.service';
import { SaveableComponent } from './saveablecomponent.class';
import { AutoSaveService } from './autosave.service';

@Component({
    selector: 'partydetail',
    templateUrl: 'app_html/partydetail.component.html'
})


export class PartyDetailComponent implements OnInit, SaveableComponent {

    @Input()
    party: Party;

    enabled: boolean = true;

    @Output()
    onSave: EventEmitter<Party> = new EventEmitter();

    // @ViewChildren("partyDetailForm")
    // partyDetailForms: QueryList<NgForm>;

    @ViewChild("partyDetailForm")
    partyDetailForm: NgForm = null;

    partytypes = [
        { value: 'houseowner', display: 'Huiseigenaar' },
        { value: 'contractor', display: 'Aannemer' },
        { value: 'supplier', display: 'Leverancier' },
        { value: 'association', display: 'Vereniging van Eigenaren' }
    ];

    partytitles = [
        { value: 'dhr', display: 'Dhr.' },
        { value: 'mevr', display: 'Mevr.' },
    ];


    constructor(private router: Router, private route: ActivatedRoute, private partyService: PartyService, private messageService: MessageService, private contentService: ContentService, private settingsService: SettingsService, private breadcrumbsService: BreadcrumbsService, private autoSaveService: AutoSaveService) {

    }

    ngOnInit() {
        // this.settingsService.getMenuEnableParties().then(s => this.enabled = (s == 'Y'));

        if (this.party == null) {
            this.route.params.forEach((params: Params) => {
                let id = +params['id'];
                this.partyService.getParty(id)
                    .then(p => {
                        this.party = p;

                        this.contentService.getContentItem('app.menu.parties')
                            .then(s => {
                                this.breadcrumbsService.reset();
                                this.breadcrumbsService.pushCrumb(s, '/parties');
                                this.breadcrumbsService.pushCrumb(p.getDisplayString(), null);
                            });
                    });
            });
        }

        if (this.partyDetailForm) {
            this.startMonitoring();
        }
    }

    // ngAfterViewInit() {
    //     this.partyDetailForms.changes
    //         .subscribe((comps: QueryList<NgForm>) => {
    //             if (!this.partyDetailForm && comps.length > 0) {
    //                 this.partyDetailForm = comps.first;
    //             }
    //             this.startMonitoring();
    //         });
    // }

    save(): Promise<any> {
        return this.partyService.updateParty(this.party)
            .then(p => {
                this.party = Party.parse(p);
                this.onSave.emit(this.party);
            });
    }

    startMonitoring() {
        if (this.partyDetailForm) {
            this.autoSaveService.startMonitoring(this, this.getNgForm());
        }
    }

    private getNgForm(): NgForm {
        return this.partyDetailForm;
    }


}