import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Party } from './party.class';
import { PartyService } from './party.service';
import { PartyAccountService } from './partyaccount.service';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';
import { BreadcrumbsService } from './breadcrumbs.service';

@Component({
    selector: 'parties',
    templateUrl: 'app_html/parties.component.html'
})

export class PartiesComponent implements OnInit {

    parties: Party[];
    enabled: boolean = false;

    constructor(private router: Router, private partyService: PartyService, private partyAccountService: PartyAccountService, private contentService: ContentService, private settingsService: SettingsService, private breadcrumbsService: BreadcrumbsService) {
    }

    ngOnInit() {
        this.settingsService.getMenuEnableParties().then(s => this.enabled = (s == 'Y'));
        this.forceUpdate();

        this.contentService.getContentItem('app.menu.parties')
            .then(s => {
                this.breadcrumbsService.reset();
                this.breadcrumbsService.pushCrumb(s, '/parties');
            });
    }

    add() {
        this.partyService.addNewParty()
            .then(p => {
                this.forceUpdate();
                let link = ['/parties', p.id];
                this.router.navigate(link);
            })
    }

    delete(event: any, p: Party) {
        this.partyService.deleteParty(p)
            .then(() => {
                this.forceUpdate();
            });
        event.stopPropagation();
    }

    forceUpdate() {
        this.parties = new Array<Party>();
        this.partyService.getParties().then(parties => {
            this.parties = parties.sort((a: Party, b: Party) => {
                let toReturn: number = 0;
                let name_a: string = a.getDisplayString().toLowerCase();
                let name_b: string = b.getDisplayString().toLowerCase();
                if (name_a > name_b) {
                    toReturn = 1;
                } else if (name_b > name_a) {
                    toReturn = -1;
                }
                // console.log('comparing: ' + name_a + ' to ' + name_b + ' => ' + toReturn);
                return toReturn;
            });
        });
    }

    goToDetails(p: Party) {
        let link = ['/parties', p.id];
        this.router.navigate(link);
    }



}