import { Component, OnInit, Input, Output, EventEmitter, ViewChild, QueryList } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Party } from './party.class';
import { PartyAccountService } from './partyaccount.service';
import { BreadcrumbsService } from './breadcrumbs.service';
import { ContentService } from './content.service';
import { PartyDetailComponent } from './partydetail.component';

@Component({
    selector: 'partydetailsignedinparty',
    templateUrl: 'app_html/partydetailsignedinparty.component.html'
})


export class PartyDetailSignedInPartyComponent implements OnInit {

    @ViewChild("partyDetailComponent")
    partyDetailComponent: PartyDetailComponent;

    party: Party;

    constructor(private partyAccountService: PartyAccountService, private contentService: ContentService, private breadcrumbsService: BreadcrumbsService) {

    }

    ngOnInit() {
        // console.log('ngOnInit');
        this.contentService.getContentItem('app.menu.partyaccount.partiessignedinparty')
            .then(s => {
                this.breadcrumbsService.reset();
                this.breadcrumbsService.pushCrumb(s, null);
            });

        this.partyAccountService.getSignedInParty()
            .then(p => this.party = p);
    }


    onSave(p: Party) {
        this.party = p;
        this.partyAccountService.signedInParty = this.party;
    }

    // ngAfterViewInit() {
    // console.log('ngAfterViewInit');
    // this.partyDetailComponent.startMonitoring();
    // }
}