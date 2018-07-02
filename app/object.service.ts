import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ObjectBean } from './objectbean.class';
import { BeanService } from './bean.service';
import { MessageService } from './message.service';

@Injectable()
export class ObjectService extends BeanService {

	protected apiName = 'object';
	private objects: ObjectBean[] = null;
	private selectedObjects: ObjectBean[] = new Array<ObjectBean>();
	public defaultHouseparts: any[];

	constructor(protected http: Http, protected messageService: MessageService) {
		super(http, messageService);
		this.getDefaultHouseparts();
	}

	getApiName(): string {
		return this.apiName;
	}

	getObjects(): Promise<ObjectBean[]> {
		if (this.objects == null) {

			return this.http.get(this.getApiUrl())
				.toPromise()
				.then((response: Response) => {
					let b: ObjectBean[] = response.json().data as ObjectBean[];

					this.objects = new Array<ObjectBean>();

					b.forEach((o: ObjectBean) => {
						this.objects.push(ObjectBean.parse(o));
					});

					return this.objects;
				})
				.catch((error: any) => this.handleError(error));
		}
		else {
			return Promise.resolve(this.objects);
		}
	}

	getSelectedObjects() {
		return Promise.resolve(this.selectedObjects);
	}

	getObject(id: number): Promise<ObjectBean> {
		return this.getObjects()
			.then(objects => {
				return objects.find(object => {
					return object.id == id;
				});
			});
	}

	addNewObject(): Promise<ObjectBean> {
		var o: ObjectBean = new ObjectBean();
		// return this.addNewBean(o)
		// 	.then(object => {
		// 		this.objects.push(object);
		// 		return object;
		// 	});

		return this.http
			.post(this.getApiUrl(), JSON.stringify(o), this.options)
			.toPromise()
			.then((response: Response) => response.json().data as any)
			.then(object => {
				this.objects.push(ObjectBean.parse(object));
				return object;
			})
			.catch((error: any) => this.handleError(error));
	}

	updateObject(object: ObjectBean): Promise<ObjectBean> {

		const url = `${this.getApiUrl()}/${object.id}`;

		return this.http
			.post(url, JSON.stringify(object), this.options)
			.toPromise()
			.then((response: Response) => {
				let o = response.json().data;
				return this.getObjects()
					.then(objects => {
						let index = objects.findIndex(object => {
							return object.id == o.id;
						});
						this.objects[index] = ObjectBean.parse(o);
						return o;
					});
			})
			.catch((error: any) => this.handleError(error));
	}

	deleteObject(objectToDelete: ObjectBean): Promise<ObjectBean> {
		// return this.deleteBean(objectToDelete).then(object => {
		// 	this.objects = this.objects.filter(o => o.id !== objectToDelete.id);
		// 	this.selectedObjects = this.selectedObjects.filter(o => o.id !== objectToDelete.id);
		// 	return object;
		// });

		return this.http
			.delete(this.getApiUrl() + '/' + objectToDelete.id)
			.toPromise()
			.then((response: Response) => response.json().data as any)
			.then(object => {
				this.objects = this.objects.filter(o => o.id !== objectToDelete.id);
				this.selectedObjects = this.selectedObjects.filter(o => o.id !== objectToDelete.id);
				return object;
			})
			.catch((error: any) => this.handleError(error));
	}

	toggleObjectSelection(o: ObjectBean) {
		var temp: ObjectBean;

		temp = this.selectedObjects.find(object => object.id === o.id);

		if (temp === undefined) {
			this.selectedObjects.push(o);
		}
		else {
			var index = this.selectedObjects.indexOf(temp, 0);
			if (index > -1) {
				this.selectedObjects.splice(index, 1);
			}
		}

	}

	isObjectSelected(o: ObjectBean) {
		var temp: ObjectBean;

		temp = this.selectedObjects.find(object => object.id === o.id);

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

}