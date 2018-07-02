import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';
import { BeanService } from './bean.service';

@Component({
	selector: 'home',
	templateUrl: '/api/contentitem/value/home.html'
})

export class HomeComponent implements OnInit, OnDestroy {

	id: number;
	isHomeComponent: boolean = true;
	enabled: boolean = false;
	// content: string[];
	homePrerender: any;

	constructor(private router: Router, private route: ActivatedRoute, private contentService: ContentService, private settingsService: SettingsService) {
	}

	ngOnInit() {
		// console.log('init home');
		this.homePrerender = document.getElementById("homePrerender");

		this.homePrerender.style.display = null;
		// this.settingsService.getMenuEnableHome().then(s => this.enabled = (s == 'Y'));

		this.route.params.forEach((params: Params) => {
			let pId = +params['id'];
			this.id = pId;
		});

		// console.log(this.route);
	}


	ngOnDestroy() {
		// console.log('destroy home');
		this.homePrerender.style.display = 'none';
	}



}