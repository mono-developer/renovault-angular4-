import { Component, OnInit, Input } from '@angular/core';
import { Report } from './report.class';
import { ReportService } from './report.service';

@Component({
  selector: 'reportdetail',
  templateUrl: '/api/report/template'
})

export class ReportDetailComponent implements OnInit {

  @Input()
  reportName: string;

  @Input()
  parameters: string;

  report: Report;
  datasets: any[];
  variables: any;

  constructor(private reportService: ReportService) {
  }

  ngOnInit() {
    this.reset();
  }

  reset() {
    this.reportService.getReport(this.reportName)
      .then(report => {
        this.report = report;
        this.reportService.getData(this.report, this.parameters)
          .then(data => {
            this.datasets = data;
          });
      });
    this.variables = {};
  }

  log(something: any) {
    console.log(something);
  }

  getArrayValue(arr: Array<any>, compareField: string, compareValue: string, retrieveField) {

    if (arr != null && arr.length > 0) {
      var tmp = arr.find(element => element[compareField] == compareValue);
      if (tmp != null) {
        return tmp[retrieveField];
      }
    }

    return null;
  }

  getArray(arr: Array<any>, compareField: string, compareValue: string) {
    if (arr != null && arr.length > 0) {
      return arr.filter(element => element[compareField] == compareValue);
    }
    else {
      return [];
    }
  }

  storeVar(...args: any[]) {

    for (let i = 0; i < arguments.length; i = i + 2) {
      this.variables[args[i]] = arguments[i + 1];
    }

    return true;
  }

  getVar(key: string) {
    return this.variables[key];
  }

}