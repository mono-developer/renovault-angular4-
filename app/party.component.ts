import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Party } from './party.class';
import { PartyService } from './party.service';
import { ContentService } from './content.service';

@Component({
    selector: 'party',
    templateUrl: 'app_html/party.component.html'
})

export class PartyComponent implements OnInit {

    @Input()
    party: Party;

    @Output()
    onDeleteClicked = new EventEmitter<any>();

    constructor(private router: Router, private partyService: PartyService, private contentService: ContentService) {
    }

    ngOnInit() {
    }

    goToDetails() {
        let link = ['/parties', this.party.id];
        this.router.navigate(link);
    }

    delete(object: Object): void {
        this.onDeleteClicked.emit(null);
    }

}