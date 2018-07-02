import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { MessageService } from './message.service';

@Injectable()
export abstract class BeanService {

	private apiBase = '/api';

	protected apiName = '';
	protected headers = new Headers({
		'Content-Type': 'application/json',
		'Access-Control-Allow-Credentials': 'true'
	});
	protected options = new RequestOptions({ headers: this.headers, withCredentials: true });

	constructor(protected http: Http, protected messageService: MessageService) {
	}

	private getApiBase(): string {
		return this.apiBase;
	}

	abstract getApiName(): string;

	protected getApiUrl(): string {
		return this.getApiBase() + '/' + this.getApiName();
	}

	private getCrudApiUrl(): string {
		return this.getApiBase() + '/crud/' + this.getApiName();
	}

	protected getBeans(): Promise<any[]> {
		return this.http.get(this.getCrudApiUrl())
			.toPromise()
			.then((response: Response) => {
				return response.json().data as any[];
			})
			.catch((error: any) => this.handleError(error));
	}

	protected getBean(id: number): Promise<any> {
		return this.getBeans()
			.then(beans => beans.find(bean => bean.id == id));
	}

	protected addNewBean(newBean: any): Promise<any> {
		return this.http
			.post(this.getCrudApiUrl(), JSON.stringify(newBean), this.options)
			.toPromise()
			.then((response: Response) => response.json().data as any)
			.catch((error: any) => this.handleError(error));
	}

	protected updateBean(bean: any): Promise<any> {
		const url = `${this.getCrudApiUrl()}/${bean.id}`;

		return this.http
			.post(url, JSON.stringify(bean), this.options)
			.toPromise()
			.then((response: Response) => response.json().data)
			.catch((error: any) => this.handleError(error));
	}

	protected deleteBean(bean: any): Promise<any> {
		const url = `${this.getCrudApiUrl()}/${bean.id}`;

		return this.http
			.delete(url, this.options)
			.toPromise()
			.then((response: Response) => response.json().data)
			.catch((error: any) => this.handleError(error));
	}

	protected handleError(error: any): Promise<any> {
		this.messageService.sendMessage(error, error._body);
		return Promise.resolve(null);
	}

}