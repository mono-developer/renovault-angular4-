import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ObjectBean } from './objectbean.class';
import { BeanService } from './bean.service';
import { MessageService } from './message.service';

@Injectable()
export class ExternalDatasetService extends BeanService {

    protected apiName = 'externaldataset';

    constructor(protected http: Http, protected messageService: MessageService) {
        super(http, messageService);
    }

    getApiName(): string {
        return this.apiName;
    }

    queryBag(postalcode: string, housenumber: string, housenumberadd: string): Promise<any> {
        return this.http.get(this.getApiUrl() + '/querybag/' + postalcode + '/' + housenumber + '/' + housenumberadd)
            .toPromise()
            .then(response => {
                return response.json().data;
            })
            .catch((error: any) => this.handleError(error));
    }

}