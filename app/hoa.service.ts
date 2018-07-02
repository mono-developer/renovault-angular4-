import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Hoa } from './hoa.class';
import { BeanService } from './bean.service';
import { MessageService } from './message.service';
import { HoaMember } from './hoamember.class';
import { ObjectBean } from './objectbean.class';

@Injectable()
export class HoaService extends BeanService {

	protected apiName = 'hoa';
	private hoas: Hoa[] = null;
	private selectedHoas: Hoa[] = new Array<Hoa>();
	public defaultHouseparts: any[];

	constructor(protected http: Http, protected messageService: MessageService) {
		super(http, messageService);
		this.getDefaultHouseparts();
	}

	getApiName(): string {
		return this.apiName;
	}

	getHoas(): Promise<Hoa[]> {
		if (this.hoas == null) {

			return this.http.get(this.getApiUrl())
				.toPromise()
				.then((response: Response) => {
					let b: Hoa[] = response.json().data as Hoa[];

					this.hoas = new Array<Hoa>();

					b.forEach((o: Hoa) => {
						this.hoas.push(Hoa.parse(o));
					});

					return this.hoas;
				})
				.catch((error: any) => this.handleError(error));
		}
		else {
			return Promise.resolve(this.hoas);
		}
	}

	getSelectedHoas() {
		return Promise.resolve(this.selectedHoas);
	}

	getHoa(id: number): Promise<Hoa> {
		return this.getHoas()
			.then(hoas => {
				return hoas.find(hoa => {
					return hoa.id == id;
				});
			});
	}

	addNewHoa(): Promise<Hoa> {
		var o: Hoa = new Hoa();
		// return this.addNewBean(o)
		// 	.then(hoa => {
		// 		this.hoas.push(hoa);
		// 		return hoa;
		// 	});

		return this.http
			.post(this.getApiUrl(), JSON.stringify(o), this.options)
			.toPromise()
			.then((response: Response) => response.json().data as any)
			.then(hoa => {
				this.hoas.push(Hoa.parse(hoa));
				return hoa;
			})
			.catch((error: any) => this.handleError(error));
	}

	updateHoa(hoa: Hoa): Promise<Hoa> {

		const url = `${this.getApiUrl()}/${hoa.id}`;

		return this.http
			.post(url, JSON.stringify(hoa), this.options)
			.toPromise()
			.then((response: Response) => {
				let o = response.json().data;
				return this.getHoas()
					.then(hoas => {
						let index = hoas.findIndex(hoa => {
							return hoa.id == o.id;
						});
						this.hoas[index] = Hoa.parse(o);
						return o;
					});
			})
			.catch((error: any) => this.handleError(error));
	}

	deleteHoa(hoaToDelete: Hoa): Promise<Hoa> {
		// return this.deleteBean(hoaToDelete).then(hoa => {
		// 	this.hoas = this.hoas.filter(o => o.id !== hoaToDelete.id);
		// 	this.selectedhoas = this.selectedhoas.filter(o => o.id !== hoaToDelete.id);
		// 	return hoa;
		// });

		return this.http
			.delete(this.getApiUrl() + '/' + hoaToDelete.id)
			.toPromise()
			.then((response: Response) => response.json().data as any)
			.then(hoa => {
				this.hoas = this.hoas.filter(o => o.id !== hoaToDelete.id);
				this.selectedHoas = this.selectedHoas.filter(o => o.id !== hoaToDelete.id);
				return hoa;
			})
			.catch((error: any) => this.handleError(error));
	}

	toggleHoaSelection(o: Hoa) {
		var temp: Hoa;

		temp = this.selectedHoas.find(hoa => hoa.id === o.id);

		if (temp === undefined) {
			this.selectedHoas.push(o);
		}
		else {
			var index = this.selectedHoas.indexOf(temp, 0);
			if (index > -1) {
				this.selectedHoas.splice(index, 1);
			}
		}

	}

	isHoaSelected(o: Hoa) {
		var temp: Hoa;

		temp = this.selectedHoas.find(hoa => hoa.id === o.id);

		if (temp === undefined) {
			return false;
		}

		return true;
	}


	getDefaultHouseparts(): Promise<any> {
		if (this.defaultHouseparts) {
			return Promise.resolve(this.defaultHouseparts);
		}
		else {
			return this.http.get(this.getApiUrl() + '/defaulthouseparts')
				.toPromise()
				.then((response: Response) => {
					this.defaultHouseparts = response.json().data;
					return this.defaultHouseparts;
				})
				.catch((error: any) => this.handleError(error));
		}
	}

	getHousepartName(id: number) {
		var hp: any;
		hp = this.defaultHouseparts.find(hp => hp.id == id);
		if (hp == undefined) {
			return '';
		}
		return hp.text;
	}

	getHoaMembers(hoa: Hoa): Promise<HoaMember[]> {
		const url = `${this.getApiUrl()}/member/${hoa.id}`;

		return this.http.get(url)
			.toPromise()
			.then((response: Response) => {
				let b: HoaMember[] = response.json().data as HoaMember[];

				let hoaMembers = new Array<HoaMember>();

				b.forEach((m: HoaMember) => {
					hoaMembers.push(HoaMember.parse(m));
				});

				return hoaMembers;
			})
			.catch((error: any) => this.handleError(error));
	}


	addHoaMember(hoa: Hoa, hoaMember: HoaMember): Promise<HoaMember> {

		const url = `${this.getApiUrl()}/member/${hoa.id}`;

		return this.http
			.post(url, JSON.stringify(hoaMember), this.options)
			.toPromise()
			.then((response: Response) => response.json().data as any)
			.then(hoa => {
				this.hoas.push(Hoa.parse(hoa));
				return hoa;
			})
			.catch((error: any) => this.handleError(error));
	}

	updateHoaMember(hoa: Hoa, hoaMember: HoaMember): Promise<Hoa> {

		const url = `${this.getApiUrl()}/member/${hoa.id}/${hoaMember.id}`;

		return this.http
			.post(url, JSON.stringify(hoaMember), this.options)
			.toPromise()
			.then((response: Response) => {
				let o = response.json().data;
				return this.getHoas()
					.then(hoas => {
						let index = hoas.findIndex(hoa => {
							return hoa.id == o.id;
						});
						this.hoas[index] = Hoa.parse(o);
						return o;
					});
			})
			.catch((error: any) => this.handleError(error));
	}

	deleteHoaMember(hoa: Hoa, hoaMemberToDelete: HoaMember): Promise<Hoa> {

		return this.http
			.delete(this.getApiUrl() + '/member/' + hoa.id + '/' + hoaMemberToDelete.id)
			.toPromise()
			.then((response: Response) => response.json().data as any)
			.then(hoa => {
				this.hoas = this.hoas.filter(o => o.id !== hoaMemberToDelete.id);
				this.selectedHoas = this.selectedHoas.filter(o => o.id !== hoaMemberToDelete.id);
				return hoa;
			})
			.catch((error: any) => this.handleError(error));
	}

}