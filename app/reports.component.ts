import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Report } from './report.class';
import { ReportService } from './report.service';

@Component({
  selector: 'reports',
  templateUrl: 'app_html/reports.component.html'
})

export class ReportsComponent implements OnInit {

  reports: Report[];
  selectedReport = -1;

  @Input()
  parameters: string;

  constructor(private router: Router, private reportService: ReportService) {
  }

  ngOnInit() {
    this.reportService.getReports().then(reports => {
      this.selectedReport = -1;
      this.reports = reports;
    });
  }

  reset() {
    this.ngOnInit();
  }

  goToDetails(p: Report, i: number) {
    // something like thisthis should be the preferred way
    // let link = ['/reports', p.id];
    // this.router.navigate(link);
    this.selectedReport = i
  }

}