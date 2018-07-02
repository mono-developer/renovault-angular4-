import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Setting } from './setting.class';
import { MessageService } from './message.service';
import { BeanService } from './bean.service';
import { Translator } from 'angular-translator';


@Injectable()
export class ContentService extends BeanService {

	protected apiName = 'contentitem';

	public contents: string[];

	private language: string;

	constructor(protected http: Http, protected messageService: MessageService, private translateService: Translator) {
		super(http, messageService);

		this.contents = Array();

		this.http.get(this.getApiUrl() + '/getSessionLanguage')
			.toPromise()
			.then((response: Response) => {
				return response.json().data as string;
			})
			.then(data => {
				this.language = data;
				this.getContents();
				// console.log(this.contents);
			})
			.catch((error: any) => this.handleError(error));
	}

	getApiName(): string {
		return this.apiName;
	}

	getContents() {
		if (this.contents.length == 0) {
			this.contents = Array();

			this.addContentItem('app.menu.home1');
			this.addContentItem('app.menu.home2');
			this.addContentItem('app.menu.home3');
			this.addContentItem('app.menu.home4');
			this.addContentItem('app.menu.home1.link');
			this.addContentItem('app.menu.home2.link');
			this.addContentItem('app.menu.home3.link');
			this.addContentItem('app.menu.home4.link');
			this.addContentItem('app.menu.objects');
			this.addContentItem('app.menu.hoas');
			this.addContentItem('app.menu.projects');
			this.addContentItem('app.menu.parties');
			this.addContentItem('app.menu.partyaccount');
			this.addContentItem('app.menu.partyaccount.partiessignedinparty');
			this.addContentItem('app.menu.partyaccount.partyaccount');
			this.addContentItem('app.menu.partyaccount.logoff');
			this.addContentItem('app.menu.partyaccount.logon');
			this.addContentItem('app.menu.partyaccount.extraentry1');
			this.addContentItem('app.menu.partyaccount.extraentry2');
			this.addContentItem('app.menu.partyaccount.extraentry3');
			this.addContentItem('app.menu.partyaccount.extraentry4');
			this.addContentItem('app.menu.partyaccount.extraentry5');

			this.addContentItem('home.text1');
			this.addContentItem('home.text2');
			this.addContentItem('home.text3');
			this.addContentItem('home.text4');
			this.addContentItem('home.text5');
			this.addContentItem('home.text6');

			this.addContentItem('objectdetail.heading1');
			this.addContentItem('objectdetail.heading2');
			this.addContentItem('objectdetail.heading3');
			this.addContentItem('objectdetail.heading4');
			this.addContentItem('objectdetail.heading5');
			this.addContentItem('objectdetail.heading6');

			this.addContentItem('hoadetail.heading1');
			this.addContentItem('hoadetail.heading2');
			this.addContentItem('hoadetail.heading3');
			this.addContentItem('hoadetail.heading4');
			this.addContentItem('hoadetail.heading5');
			this.addContentItem('hoadetail.heading6');

			this.addContentItem('site.title');
			this.addContentItem('site.subtitle');
			this.addContentItem('site.logo');
			this.addContentItem('site.button.add');
			this.addContentItem('site.button.select');
			this.addContentItem('site.button.details');
			this.addContentItem('site.button.delete');
			this.addContentItem('site.button.save');
			this.addContentItem('site.button.share');

			this.addContentItem('partyaccount.heading1');
			this.addContentItem('partyaccount.heading2');
			this.addContentItem('partyaccount.heading3');
			this.addContentItem('partyaccount.heading4');
			this.addContentItem('partyaccount.heading5');
			this.addContentItem('partyaccount.heading6');
			this.addContentItem('partyaccount.button.multipleobjects');
			this.addContentItem('partyaccount.button.logoff');
			this.addContentItem('partyaccount.button.logon');
			this.addContentItem('partyaccount.button.register');
			this.addContentItem('partyaccount.button.modify');
			this.addContentItem('partyaccount.button.send');
			this.addContentItem('partyaccount.accepttermsmessage');

			this.addContentItem('party.heading1');

			this.addContentItem('projects.modal.title');

			this.addContentItem('projectdetail.heading1');
			this.addContentItem('projectdetail.heading2');
			this.addContentItem('projectdetail.heading3');
			this.addContentItem('projectdetail.heading4');
			this.addContentItem('projectdetail.heading5');
			this.addContentItem('projectdetail.button.finished');

		}
	}

	// getContent(name: string): string {
	// 	return this.contents[name];
	// }

	getContentItem(item: string): Promise<any> {
		return this.translateService.translate(item, null, this.language);
	}

	addContentItem(item: string) {
		this.getContentItem(item)
			.then(t => {
				this.contents[item] = t;
			});
	}

}