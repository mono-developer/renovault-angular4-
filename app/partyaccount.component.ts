import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { PartyAccount } from './partyaccount.class';
import { PartyAccountService } from './partyaccount.service';
import { MessageService } from './message.service';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';
import { BreadcrumbsService } from './breadcrumbs.service';

@Component({
	templateUrl: 'app_html/partyaccount.component.html'
})


export class PartyAccountComponent implements OnInit {

	@Input()
	look: string;
	enabled: boolean = false;

	password: string;
	newpassword1: string;
	newpassword2: string;

	languageOptions = [
		{ value: 'nl', display: 'Nederlands' },
		{ value: 'en', display: 'English' },
	];

	constructor(private router: Router, private route: ActivatedRoute, private partyAccountService: PartyAccountService, private messageService: MessageService, private contentService: ContentService, private settingsService: SettingsService, private breadcrumbsService: BreadcrumbsService) {

	}

	ngOnInit() {
		this.settingsService.getMenuEnablePartyAccount().then(s => this.enabled = (s == 'Y'));
		this.contentService.getContentItem('app.menu.partyaccount.partyaccount')
			.then(s => {
				this.breadcrumbsService.reset();
				this.breadcrumbsService.pushCrumb(s, null);
			});
	}

	save() {
		this.partyAccountService.updatePartyAccount(this.partyAccountService.signedInPartyAccount);
	}

	changePassword() {
		this.partyAccountService.changePassword(this.password, this.newpassword1)
			.then(p => {
				this.password = "";
				this.newpassword1 = "";
				this.newpassword2 = "";
				this.messageService.sendMessage("Uw wachtwoord is gewijzigd.", "");
			});
	}



}