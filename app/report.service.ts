import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Report } from './report.class';
import { BeanService } from './bean.service';
import { MessageService } from './message.service';

@Injectable()
export class ReportService extends BeanService {

    protected apiName = 'report';
    private reports: Report[] = null;

    constructor(protected http: Http, protected messageService: MessageService) {
        super(http, messageService);
    }

    getApiName(): string {
        return this.apiName;
    }

    getReports(): Promise<Report[]> {
        if (this.reports == null) {
            return this.http.get(this.getApiUrl())
                .toPromise()
                .then((response: Response) => {
                    return response.json().data as any[];
                })
                .catch((error: any) => this.handleError(error));
        }
        else {
            return Promise.resolve(this.reports);
        }
    }

    getReport(name: string): Promise<Report> {
        return this.http.get(this.getApiUrl() + '/' + name)
            .toPromise()
            .then((response: Response) => {
                return response.json().data as Report;
            })
            .catch((error: any) => this.handleError(error));
    }

    getData(report: Report, parameters: string): Promise<any[]> {

        return this.http.get(this.getApiUrl() + '/' + report.id + '/data/' + parameters + '/JSON')
            .toPromise()
            .then((response: Response) => {
                return response.json().data as any[];
            })
            .catch((error: any) => this.handleError(error));
    }

}
