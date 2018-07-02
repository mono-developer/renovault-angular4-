import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Security } from './security.class';
import { BeanService } from './bean.service';
import { MessageService } from './message.service';

@Injectable()
export class SecurityService extends BeanService {

	protected apiName = 'security';

	constructor(protected http: Http, protected messageService: MessageService) {
		super(http, messageService);
	}

	getApiName(): string {
		return this.apiName;
	}

	getSecurityRecords(): Promise<Security[]> {
		return this.getBeans();
	}

	getSecurity(id: number): Promise<Security> {
		return this.getBean(id);
	}

	getSecurityForTable(referencetable: string, referenceid: number) {
		return this.http
			.get(this.getApiUrl() + '/' + referencetable + '/' + referenceid)
			.toPromise()
			.then((response: Response) => response.json().data as any)
			.then(security => {
				return security;
			})
			.catch((error: any) => this.handleError(error));
	}

	addNewSecurity(security: Security): Promise<Security> {
		return this.http
			.post(this.getApiUrl(), JSON.stringify(security), this.options)
			.toPromise()
			.then((response: Response) => response.json().data as any)
			.then(security => {
				return security;
			})
			.catch((error: any) => this.handleError(error));
	}

	updateSecurity(security: Security): Promise<Security> {
		const url = `${this.getApiUrl()}/${security.id}`;

		return this.http
			.post(url, JSON.stringify(security), this.options)
			.toPromise()
			.then((response: Response) => response.json().data)
			.catch((error: any) => this.handleError(error));
	}

	deleteSecurity(toDelete: Security): Promise<Security> {
		const url = `${this.getApiUrl()}/${toDelete.id}`;

		return this.http
			.delete(url, this.options)
			.toPromise()
			.then((response: Response) => response.json().data)
			.catch((error: any) => this.handleError(error));
	}

	transferSecurity(transferFrom: Security, transferTo: Security): Promise<Security> {
		const url = `${this.getApiUrl()}/transfer/${transferFrom.id}/${transferTo.id}`;

		return this.http
			.post(url, this.options)
			.toPromise()
			.then((response: Response) => response.json().data)
			.catch((error: any) => this.handleError(error));
	}
}