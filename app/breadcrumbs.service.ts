import { Injectable } from '@angular/core';
import { Breadcrumb } from './breadcrumb.class';
import { Router, ActivatedRoute } from "@angular/router"; //, NavigationEnd, Params, PRIMARY_OUTLET

@Injectable()
export class BreadcrumbsService {

	public breadcrumbs: Breadcrumb[];
	public activecrumb: Breadcrumb;
	private maxCrumbs: number = 3;

	constructor(private activatedRoute: ActivatedRoute, private router: Router) {
		this.reset();
	}

	pushCrumb(title: string, link: string) {
		if (this.activecrumb) {
			this.breadcrumbs.push(this.activecrumb);
		}

		let l = link;
		if (l == null) {
			l = this.router.url;
		}
		let b = new Breadcrumb(title, l);
		this.activecrumb = b;
	}

	reset() {
		this.breadcrumbs = new Array();
		this.activecrumb = null;
	}

	// public showBreadcrumbs() {
	// 	this.show = true;
	// }

	// public hideBreadcrumbs() {
	// 	this.show = false;
	// }

}