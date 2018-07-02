import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Image } from './image.class';
import { BeanService } from './bean.service';
import { MessageService } from './message.service';


@Injectable()
export class ImageService extends BeanService {

	protected apiName = 'image';

	constructor(protected http: Http, protected messageService: MessageService) {
		super(http, messageService);
	}

	getApiName(): string {
		return this.apiName;
	}

	getImages(reference_table: string, reference_id: number, reference_string: string): Promise<Image[]> {
		return this.http.get(this.getApiUrl() + '/' + reference_table + '/' + reference_id + '/' + reference_string)
			.toPromise()
			.then(response => {
				return response.json().data;
			})
			.catch((error: any) => this.handleError(error));
	}


	getBucketUploadHandler(): Promise<string> {
		return this.http.get(this.getApiUrl() + '/bucket_session')
			.toPromise()
			.then(response => {
				return response.json().data;
			})
			.catch((error: any) => this.handleError(error));
	}

	deleteImage(image: Image): Promise<Image> {
		return this.deleteBean(image);
	}

	updateImage(image: Image): Promise<Image> {
		return this.updateBean(image);
	}


	public getImageUrl(image: Image, isDownload: boolean) {
		if (isDownload) {
			return '/api/image/download/' + image.id;
		}
		else {
			return '/api/image/embed/' + image.id;
		}
	}

	public getImageThumbnailUrl(image: Image) {
		if (this.getImageInternalType(image) == 'image') {
			// return image.baseurl;
			return this.getImageUrl(image, false);
		}
		else if (image.file_type_mime_icon != null) {
			return '/images/mime/' + image.file_type_mime_icon;
		}
		else {
			return '/images/mime/application_vnd.png';
		}
	}

	public getImageInternalType(image: Image) {
		if (image.file_type != null && image.file_type.startsWith('image')) {
			return 'image';
		}
		else if (image.file_type != null && image.file_type == 'application/pdf') {
			return 'pdf';
		}
		else {
			return "";
		}
	}


}